import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Env, type Context } from "./types";

export async function execWithContext(fn: (c: Context) => Promise<void>) {
  const env = Env.parse(process.env);
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  client.once("ready", async () => {
    try {
      const channel = await client.channels.fetch(env.CHANNEL_ID);
      if (!channel?.isTextBased()) {
        console.error("指定チャンネルが見つからないか、テキストチャンネルではありません");
        return;
      }
      if (!channel.isSendable()) {
        console.error("チャンネルはメッセージ送信不可能です");
        return;
      }

      const ctx: Context = {
        env,
        channel,
        client,
      };

      await fn(ctx);
    } finally {
      client.destroy();
    }
  });
  client.login(env.DISCORD_TOKEN);
}
