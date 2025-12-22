export function env(name: string) {
  const e = process.env[name];
  if (!e) throw new Error(`Environment variable not found for ${name}`);
  return e;
}

// should not throw
export async function retry(
  count: number,
  func: () => Promise<string>
): Promise<string | Error> {
  let err: Error = new Error("失敗していません");
  for (const _ of new Array(count).fill(0)) {
    try {
      return await func();
    } catch (e) {
      console.error(e);
      err = e as Error;
    }
  }
  return err;
}

export async function webhook(message: string) {
  const url = env("DISCORD_WEBHOOK_URL");
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
}

export async function queryNotion(query: object) {
  return await fetch(
    "https://api.notion.com/v1/databases/e8d7215f-b522-4be4-a9a3-e7d3be4d41ff/query",
    {
      method: "POST",
      headers: {
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
        Authorization: `Bearer ${env("NOTION_API_KEY")}`,
      },
      body: JSON.stringify(query),
    }
  );
}
