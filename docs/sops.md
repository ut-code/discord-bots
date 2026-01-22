# SOPS セットアップ

[SOPS](https://github.com/getsops/sops) を使って環境変数を暗号化し、Git で安全に管理する。

1. `direnv allow` で開発環境に入る
2. `age-keygen -o .age-key` で自分用のキーを生成（公開鍵が表示される）
3. `.sops.yaml` に公開鍵を追加

```yaml
_:
 deploy: &deploy age12n68j7wyf97vrw4jwr5x0gf2zdcumh65r9uq3mctsa6y9f8ex4yqm2gx06
 your-name: &your-name age1yyy...

creation_rules:
 - path_regex: bots/<your-bot>/.*
   age:
     - *deploy
     - *your-name
```

4. `sops bots/<your-bot>/sops.env` で作成・編集
5. `sops.env` をコミット

## 復号してコマンド実行

```bash
sops exec-env sops.env 'your-command'
```

## 再暗号化

`.sops.yaml`のキーを変更した後に実行:

```bash
sops updatekeys sops.env
```

## 公開鍵を取得

```bash
age-keygen -y .age-key
```
