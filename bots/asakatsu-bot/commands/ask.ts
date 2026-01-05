import { execWithContext } from "../lib/executor";
import { REACTION, type Context } from "../lib/types";

await execWithContext(async (c) => {
	const poll = await c.channel.send(
		`[明日の朝活意思確認]
明日の朝 8:00 までに起きる予定の人は、このメッセージに ${REACTION} を付けてください。
起きたら、何かしらのメッセージを投稿してください。(起きていないと警告メッセージが飛びます)`,
	);
	await poll.react(REACTION);
});
