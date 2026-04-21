# Set SOPS_AGE_KEY_FILE if .age-key exists (sourced by mise.toml)
_repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -f "$_repo_root/.age-key" ] && export SOPS_AGE_KEY_FILE="$_repo_root/.age-key"
unset _repo_root
