# Discord Bots

## 開発

特に記述することはなし

## Bot追加方法

1.

```sh
mkdir bots/YOUR_BOT
```

2. bots/YOUR_BOT にBotを書く
3. `rollcron.yaml` に YOUR_BOT の cron スケジュールとスクリプトを書く。
4. VPS にすでに実行環境がない場合は、実行環境を作る (Docker ランナーはそのうちサポートする予定)

## デプロイ

環境変数が必要な場合は VPS 上に variables/discord-bots/YOUR_BOT.env を用意してください。そのうち SOPS を導入するかもしれないし、しないかもしれない
