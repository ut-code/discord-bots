# SOPS ガイド

環境変数を [age](https://github.com/FiloSottile/age) で暗号化し、Git に安全にコミットする仕組み。

## 初回セットアップ (自分の鍵を作る)

### age 鍵を生成

```bash
age-keygen -o .age-key
# Public key: age1xxxx... ← この公開鍵をコピー
```

`.age-key` は `.gitignore` 済み。ローカル復号に使う。

### SSH 鍵を使う場合

age 鍵の代わりに既存の SSH 鍵 (Ed25519/RSA) も使える。

```bash
# SSH 公開鍵から age 公開鍵を導出
age-keygen -y /path/to/ssh/id_ed25519
# age1xxxx...
```

復号時は `SOPS_AGE_KEY_FILE` の代わりに ssh-agent が使われる。  
`.sops.yaml` には導出した age 公開鍵を登録する (手順は同じ)。

## 公開鍵を `.sops.yaml` に追加

```yaml
_:
  age-public-keys:
    - &deploy age15uc7fh...    # サーバー
    - &your-name age1xxxx...   # ← 追加

creation_rules:
  - path_regex: bots/my-bot/*
    age:
      - *deploy
      - *your-name             # ← 復号できる人を列挙
```

変更をコミット・プッシュしたら、既存の暗号化ファイルにリキーが必要 (後述)。

## 暗号化ファイルを作成・編集

```bash
EDITOR="code --wait" sops bots/my-bot/sops.env  # VS Code
EDITOR=nvim sops bots/my-bot/sops.env            # Neovim
```

エディタで復号された状態が開き、保存・終了すると自動で暗号化される。  
新規ファイルなら `KEY=VALUE` 形式で書く。`EDITOR` を省略すると `$EDITOR` or `vim` が使われる。

## Bot で使う

`run.sh` で `sops exec-env` を使う:

```bash
#!/bin/bash
sops exec-env sops.env 'bun run index.ts'
```

環境変数として復号された値がプロセスに渡される。ファイルに平文は残らない。

## リキー (鍵の追加・削除を既存ファイルに反映)

`.sops.yaml` を変更しただけでは既存ファイルには反映されない。`updatekeys` で反映する:

```bash
sops updatekeys bots/my-bot/sops.env
```

変更された `sops.env` をコミットする。

## よく使うコマンド

```bash
sops bots/my-bot/sops.env                       # 作成 or 編集
sops -d bots/my-bot/sops.env                     # 復号して stdout に表示
sops exec-env bots/my-bot/sops.env 'echo ok'    # 復号チェック (coding agent 向け)
sops updatekeys bots/my-bot/sops.env             # .sops.yaml の変更を反映
age-keygen -y .age-key                           # 自分の公開鍵を表示
```
