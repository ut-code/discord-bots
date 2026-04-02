# Discord-bots

Discord (など) で定期実行などされるBotのmonorepo。

## Bot 一覧

- bots/auto-moderator: 運営タスクリマインド (毎日)
- bots/gsc-report: Google の検索パフォーマンス通知 (毎週)
- bots/asakatsu-bot: 朝活確認 (毎日)
- bots/joji-bot: Youtube から RSS で最新動画取得 (毎日)

詳細は ./rollcron.yaml で。

## 機密情報

### 配置・権限

sops を使う場合:

- SOPS ファイル: `bots/BOT/sops.env`
- 暗号化ルール: `./.sops.yaml`

ローカル,デプロイ読み取りチェーン: `run.sh` -> `sops exec-env` -> `bots/BOT/sops.env` + (`.age-key` | `~/.config/sops/age/keys.txt`)

sops を使わない場合:

- ローカル読み取りチェーン: `run.sh` -> `bots/BOT/.env`
- デプロイ読み取りチェーン: `rollcron.yaml` -> `~/run/discord-bots/BOT/env` (サーバーに `bots/BOT/.env` は存在しないので二重読みはない)

### 管理ルール

- `.env` を読まない。`sops -d` を実行しない。`.age-key` を読まない。サーバ上の機密ファイルを読まない。
- もし確認する必要がある場合はコンテキストに入らないような仕組みでやる: `cat .env | cut -d= -f1` やハッシュ、 `wc`、コマンド直接実行など

## ファイル・インフラ配置 (.git 外)

### ローカルファイル配置

- `.age-key` - ローカル復号用

### coolify.utcode.net

- `/home/deploy/.config/sops/age/keys.txt` - デプロイ時復号用

## コマンド

```bash
eval "$(direnv export bash)" && COMMAND
sops exec-env path/to/sops.env 'echo success!' # sops 鍵検証
ssh USER@coolify.utcode.net "sudo -u deploy bash -c 'COMMAND'" # デプロイ先で操作
```
