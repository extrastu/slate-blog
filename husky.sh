#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 👇 手动加载 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm use >/dev/null

npm run lint
