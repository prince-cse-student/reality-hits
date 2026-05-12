#!/usr/bin/env bash
set -euo pipefail

LM_STUDIO_PORT="${LM_STUDIO_PORT:-1234}"

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

echo "Starting ngrok tunnel for LM Studio on port ${LM_STUDIO_PORT}."
echo "Use the HTTPS forwarding URL as:"
echo "LM_STUDIO_API_URL=https://<ngrok-host>/v1/chat/completions"
ngrok http "${LM_STUDIO_PORT}"
