#!/usr/bin/env bash
set -euo pipefail

LM_STUDIO_PORT="${LM_STUDIO_PORT:-1234}"
SESSION_NAME="${SESSION_NAME:-lmstudio-ngrok}"

if ! command -v screen >/dev/null 2>&1; then
  echo "screen is not installed. Use ./scripts/start-lmstudio-ngrok.sh instead."
  exit 1
fi

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok is not installed. Install ngrok first: https://ngrok.com/download"
  exit 1
fi

echo "Checking LM Studio at http://localhost:${LM_STUDIO_PORT}/v1/models ..."
if ! curl -fsS "http://localhost:${LM_STUDIO_PORT}/v1/models" >/dev/null; then
  echo "LM Studio is not reachable on port ${LM_STUDIO_PORT}."
  echo "Start LM Studio, load a model, enable the local server, then run this script again."
  exit 1
fi

screen -S "${SESSION_NAME}" -X quit >/dev/null 2>&1 || true
screen -dmS "${SESSION_NAME}" ngrok http "${LM_STUDIO_PORT}"

echo "Started ngrok in detached screen session: ${SESSION_NAME}"
echo "Wait a few seconds, then run:"
echo "curl -sS http://127.0.0.1:4040/api/tunnels"
