import * as v from "valibot";

/*
API REFERENCE:
https://developers.notion.com/docs/working-with-databases
https://developers.notion.com/reference/property-value-object
*/

const NotionDate = v.object({
  type: v.literal("date"),
  date: v.object({
    start: v.pipe(v.string(), v.regex(/\d{4}-\d{2}-\d{2}/) /* yyyy-MM-dd */),
  }),
});
const NotionText = v.object({
  type: v.literal("text"),
  text: v.object({
    content: v.string(),
  }),
  plain_text: v.string(),
});
const NotionTitle = v.object({
  type: v.literal("title"),
  title: v.array(v.union([NotionText])),
});

// API REFERENCE[user]: https://developers.notion.com/reference/user
const NotionUser = v.object({
  object: v.literal("user"),
  id: v.pipe(v.string(), v.uuid()),
  name: v.union([v.string(), v.undefined()]),
});

const NotionPeople = v.object({
  type: v.literal("people"),
  people: v.array(NotionUser),
});

export const NotionTypes = {
  date: NotionDate,
  text: NotionText,
  title: NotionTitle,
  user: NotionUser,
  people: NotionPeople,
};

export const Task = v.object({
  properties: v.object({
    期日: v.union([NotionTypes.date, v.undefined()]),
    タイトル: v.union([NotionTypes.title, v.undefined()]),
    担当者: v.union([NotionTypes.people, v.undefined()]),
  }),
});

export type Task = v.InferOutput<typeof Task>;
export const NotionFetchResponse = v.object({
  results: v.array(Task),
});
