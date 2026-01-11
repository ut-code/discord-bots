import type { Client, SendableChannels } from "discord.js";

import { z } from "zod";

export const Env = z.object({
  DISCORD_TOKEN: z.string(),
  CHANNEL_ID: z.string(),
});
export type Env = z.infer<typeof Env>;

export const REACTION = "👍";

export type Context = {
  env: Env;
  channel: SendableChannels;
  client: Client;
};
