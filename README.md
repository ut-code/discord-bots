# Discord-bots

Discord (など) で定期実行などされるBotのmonorepo。

## Bot 一覧

- bots/auto-moderator: 運営タスクリマインド (毎日)
- bots/gsc-report: Google の検索パフォーマンス通知 (毎週)
- bots/asakatsu-bot: 朝活確認 (毎日)
- bots/joji-bot: Youtube から RSS で最新動画取得 (毎日)

詳細は ./rollcron.yaml で。

## 開発環境

[mise](https://mise.jdx.dev/) でツール管理。`mise.toml` 参照。

```bash
mise doctor  # "activated: yes" を確認
mise install # ツールをインストール (初回 or mise.toml 変更時)
```

`activated: no` の場合はシェルRCに `mise activate` を追加する。詳細は [mise docs](https://mise.jdx.dev/getting-started.html) を参照。

## Bot を追加する

### 1. `bots/` にフォルダを作る

### 2. コードを書く

### 3. `run.sh` を作る

### 4. `rollcron.yaml` に追加

```yaml
my-bot:
  schedule: "7pm" # 下記参照
  working_dir: bots/my-bot
  run: ./run.sh
  log: ~/run/discord-bots/my-bot/log
  # build: ./build.sh  # コンパイルが必要な場合
  # env_file: ~/run/discord-bots/my-bot/env  # 環境変数が必要な場合
```

schedule の書き方:

```
"7pm"                   "8:30am"              "noon"
"7pm every Monday"      "midnight every Friday"
"7am every Sunday"      "6pm every 3 days"
"0 19 * * *"            "30 8 * * 1-5"        "0 0 1 * *"
```

### 5. `CODEOWNERS` に追加

```
/bots/my-bot/ @your-github-username
```

### 6. 環境変数

2通りの方法がある:

```
1. rollcron.yaml (env_file → .env) → run.sh → program
2. rollcron.yaml → run.sh → (sops → sops.env) → program
```

SOPS を使う場合は [docs/sops.md](docs/sops.md) を参照。

## 機密情報

### 配置・権限

sops を使う場合:

- SOPS ファイル: `bots/BOT/sops.env`
- 暗号化ルール: `./.sops.yaml`

ローカル,デプロイ読み取りチェーン: `run.sh` -> `sops exec-env` -> `bots/BOT/sops.env` + (`.age-key` | `~/.config/sops/age/keys.txt`)

sops を使わない場合:

- ローカル読み取りチェーン: `run.sh` -> `bots/BOT/.env`
- デプロイ読み取りチェーン: `rollcron.yaml` -> `~/run/discord-bots/BOT/env` (サーバーに `bots/BOT/.env` は存在しないので二重読みはない)

詳細は [docs/sops.md](docs/sops.md) を参照。

## ファイル・インフラ配置 (.git 外)

### ローカルファイル配置

- `.age-key` - ローカル復号用

### coolify.utcode.net

- `/home/deploy/.config/sops/age/keys.txt` - デプロイ時復号用

## コマンド

```bash
sops exec-env path/to/sops.env 'echo success!' # sops 鍵検証
ssh USER@coolify.utcode.net "sudo -u deploy bash -c 'COMMAND'" # デプロイ先で操作
```

## AIエージェント向けルール

このセクションはAIコーディングエージェント (Claude Code, Codex 等) 向け。

- `.env`、`.age-key`、`sops -d` の出力、サーバ上の機密ファイルをコンテキストに入れないこと。確認が必要な場合は `cat .env | cut -d= -f1`、ハッシュ、`wc`、コマンド直接実行など値が露出しない方法を使う。
