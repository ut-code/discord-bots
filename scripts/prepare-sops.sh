# source this file from run.sh to set SOPS_AGE_KEY_FILE
_repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -f "$_repo_root/.age-key" ] && export SOPS_AGE_KEY_FILE="$_repo_root/.age-key"
unset _repo_root
