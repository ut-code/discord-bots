import * as v from "valibot";
import { idMap, nameMap, type UUID } from "./data.ts";
import { queryNotion, retry, webhook } from "./io.ts";
import { NotionFetchResponse, type Task } from "./validator.ts";

/*
API REFERENCE:
https://developers.notion.com/docs/working-with-databases
*/

// the url is safe to publish.
const NOTION_TASK_PAGE_URL =
  "https://www.notion.so/utcode/e8d7215fb5224be4a9a3e7d3be4d41ff";
const DAY = 24 * 60 * 60 * 1000;

const query = {
  filter: {
    and: [
      {
        property: "期日",
        date: {
          before: new Date(Date.now() + 3 * DAY)
            .toISOString()
            .match(/^\d{4}-\d{2}-\d{2}/)?.[0],
        },
      },
      {
        property: "対応済",
        checkbox: {
          equals: false,
        },
      },
    ],
  },
  sorts: [
    {
      property: "期日",
      direction: "ascending",
    },
  ],
};

interface FormatTaskReturn {
  formatted: string;
  unregistered: { id: string; name?: string }[];
}
function formatTask(task: Task): FormatTaskReturn {
  const due = task.properties.期日?.date.start;
  const title = task.properties.タイトル?.title
    .map((title) => title.plain_text)
    .join("");

  const unregistered: { id: string; name?: string }[] = [];

  const assignees = task.properties.担当者?.people.map((person) => {
    const discordIdFromId = idMap.get(person.id satisfies string as UUID);
    if (discordIdFromId) return `<@${discordIdFromId}>`;

    if (!unregistered.some((u) => u.id === person.id)) {
      unregistered.push({ name: person.name, id: person.id });
    }

    if (person.name) {
      const discordIdFromName = nameMap.get(person.name);
      if (discordIdFromName) {
        return `<@${discordIdFromName}>`;
      } else {
        return `@${person.name}`;
      }
    }
    return `@${person.id}`;
  });

  const assignee = assignees?.join(" ");
  const formatted = assignee
    ? `・【${due}】${title} ${assignee}`
    : `・【${due}】${title} (担当者不在)`;

  return { formatted, unregistered };
}

async function main() {
  const res = await queryNotion(query);
  const json = v.parse(NotionFetchResponse, await res.json());
  const taskResults = json.results.map(formatTask);

  if (taskResults.length === 0)
    return "本日は期限が迫っているタスクはありませんでした。";

  const tasks = taskResults.map((t) => t.formatted);
  const allUnregistered = [
    ...new Set(taskResults.flatMap((t) => t.unregistered)),
  ];

  let message = `
3日以内に期限が迫っているタスクがあります！
${tasks.join("\n")}

完了したら、タスクを対応済みにしてください。
<${NOTION_TASK_PAGE_URL}>
`.trim();

  if (allUnregistered.length > 0) {
    message += `\n\n以下のユーザーの Discord ID を登録してください:
${allUnregistered.map((u) => `\`${u.id}\`: ${u.name}`).join("\n")}`;
  }

  return message;
}

const result = await retry(3, async () => await main());
if (typeof result === "string") {
  await webhook(result);
} else {
  await webhook(`Auto Moderator の実行に失敗しました: ${result.message}`);
  process.exit(1);
}
