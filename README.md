# Discord Bots

## Bot を追加する

### 1. `bots/` にフォルダを作る

### 2. コードを書く

### 3. `run.sh` を作る

### 4. `rollcron.yaml` に追加

```yaml
my-bot:
  schedule: "7pm"  # 下記参照
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
1. rollcron.yaml (env_file) → run.sh → program
2. rollcron.yaml → run.sh → sops → program
```

SOPS を使う場合は [docs/sops.md](docs/sops.md) を参照。
