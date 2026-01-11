import * as v from "valibot";

const Env = v.object({
  DISCORD_WEBHOOK_URL: v.pipe(v.string(), v.url()),
  NOTION_API_KEY: v.string(),
  DISABLE_MENTION: v.optional(
    v.pipe(
      v.string(),
      v.transform((s) => s === "1" || s === "true"),
    ),
  ),
});

export const env = v.parse(Env, process.env);
