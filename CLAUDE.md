- `sops -d` を実行しない。コマンドを実行する必要がある場合は `sops exec-env` で直接実行する
- `.age-key` を読まない。

## コマンド実行方法

```bash
eval "$(direnv export bash)" && <command>
```
