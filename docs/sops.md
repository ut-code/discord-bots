# SOPS セットアップ

環境変数を暗号化して Git に安全にコミットする。

## 初回セットアップ

```bash
# 1. 鍵を作成（公開鍵が表示される → コピー）
age-keygen -o .age-key

# 2. .sops.yaml に公開鍵を追加してコミット
```

## 環境変数ファイルを作成

```bash
sops bots/my-bot/sops.env
```

エディタで環境変数を書いて保存。

## Bot で使う

`run.sh`:

```bash
#!/bin/bash
sops exec-env sops.env 'bun run index.ts'
```

## その他のコマンド

```bash
sops -d sops.env              # 復号して表示
sops updatekeys sops.env      # .sops.yaml の変更を反映
age-keygen -y .age-key        # 公開鍵を表示
```
