import { execWithContext } from "../lib/executor";
import { REACTION } from "../lib/types";

await execWithContext(async (ctx) => {
	const now = new Date();
	const yesterday19 = new Date(now);
	// TODO: UTC+9 以外の TZ で実行された時動かなそう
	yesterday19.setDate(now.getDate() - 1);
	yesterday19.setHours(19, 0, 0, 0);

	const msgs = await ctx.channel.messages.fetch({ limit: 100 });
	const pollMsg = msgs.find(
		(m) =>
			m.author.id === ctx.client.user?.id &&
			m.createdTimestamp >= yesterday19.getTime() &&
			m.content.startsWith("[明日の朝活意思確認]"),
	);
	if (!pollMsg) {
		console.error("昨日のアンケートが見つかりません");
		return;
	}

	const reaction = pollMsg.reactions.cache.get(REACTION);
	if (!reaction) return console.error("ERROR: リアクション無し (0)"); // ボットはいるはず
	const users = await reaction.users.fetch();
	const targets = users.filter((u) => !u.bot).map((u) => u.id);
	if (!targets.length) {
		console.log("OK: ユーザーのリアクション無し");
		return;
	}

	// TODO: 同上; UTC+9 以外の TZ で実行された時動かなそう
	const today5 = new Date(now).setHours(5, 0, 0, 0); // 5 時より前は寝る前のメッセージとする
	const todayMsgs = await ctx.channel.messages.fetch({ limit: 100 });
	const greeted = new Set(
		todayMsgs
			.filter((m) => m.createdTimestamp >= today5)
			.map((m) => m.author.id),
	);

	const sleepyheads = targets.filter((id) => !greeted.has(id));
	if (sleepyheads.length) {
		await ctx.channel.send(
			`${sleepyheads.map((id) => `<@${id}>`).join(" ")} **8 時に起きられない人、厳しいって**`,
		);
	} else {
		await ctx.channel.send("全員が起床済みでした 🎉");
	}
});
