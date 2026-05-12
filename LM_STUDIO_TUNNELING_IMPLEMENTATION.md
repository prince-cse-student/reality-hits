# LM Studio Tunneling Implementation

This document is a handoff for setting up LM Studio as a public HTTPS endpoint that the deployed Vercel backend can call.

## Goal

Keep the app deployed as:

```txt
Frontend on Vercel
  -> Backend on Vercel
    -> MongoDB Atlas
    -> LM Studio on local machine through HTTPS tunnel
    -> Gemini fallback if tunnel/model is unavailable
```

The tunnel is not part of the frontend or backend build. It is a separate long-running process on the machine that runs LM Studio.

## Current Backend Contract

The backend expects an OpenAI-compatible chat-completions URL:

```env
LM_STUDIO_API_URL=https://<public-tunnel-host>/v1/chat/completions
```

The backend now tries providers in this order:

```txt
1. LM Studio via LM_STUDIO_API_URL
2. Gemini via GEMINI_API_KEY
3. Manual-review default response
```

Relevant files:

```txt
backend/config.py
backend/services/ai_service.py
backend/.env.example
```

## Recommended Option: Cloudflare Tunnel

Use Cloudflare Tunnel for a stable demo or semi-permanent setup.

### Requirements

- LM Studio installed on the local machine.
- LM Studio local server enabled.
- A Cloudflare account.
- Ideally, a domain connected to Cloudflare for a stable hostname.
- `cloudflared` installed on the LM Studio machine.

### 1. Start LM Studio Server

In LM Studio:

1. Load the model.
2. Start the local server.
3. Confirm the server listens on:

```txt
http://localhost:1234
```

Test locally:

```bash
curl http://localhost:1234/v1/models
```

Expected: JSON with a `data` array containing the loaded model.

### 2. Quick Tunnel For Testing

Use this only for temporary testing because the URL can change:

```bash
cloudflared tunnel --url http://localhost:1234
```

It prints a public URL similar to:

```txt
https://example.trycloudflare.com
```

Set backend Vercel env:

```env
LM_STUDIO_API_URL=https://example.trycloudflare.com/v1/chat/completions
```

Then redeploy the backend.

### 3. Stable Cloudflare Tunnel

Use this for the real demo setup.

Authenticate:

```bash
cloudflared tunnel login
```

Create the tunnel:

```bash
cloudflared tunnel create reality-hits-lmstudio
```

Create a DNS route. Replace the hostname with the chosen Cloudflare-managed domain:

```bash
cloudflared tunnel route dns reality-hits-lmstudio lmstudio.example.com
```

Create a local config file at the default Cloudflare config location.

macOS/Linux:

```txt
~/.cloudflared/config.yml
```

Windows:

```txt
%USERPROFILE%\.cloudflared\config.yml
```

Example config:

```yaml
tunnel: reality-hits-lmstudio
credentials-file: /Users/<user>/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: lmstudio.example.com
    service: http://localhost:1234
  - service: http_status:404
```

Run the tunnel:

```bash
cloudflared tunnel run reality-hits-lmstudio
```

Test public model endpoint:

```bash
curl https://lmstudio.example.com/v1/models
```

Set backend Vercel env:

```env
LM_STUDIO_API_URL=https://lmstudio.example.com/v1/chat/completions
```

Redeploy the backend after changing the env var.

### 4. Optional: Run Cloudflare Tunnel As A Service

Only do this after the tunnel works manually.

macOS/Linux:

```bash
sudo cloudflared service install
```

Windows must be run from an Administrator terminal:

```powershell
cloudflared.exe service install
```

Then verify the service starts after reboot.

## Simpler Option: ngrok

Use ngrok for the fastest setup. Free URLs may change unless the account has a reserved/static domain.

This repo includes a helper script:

```bash
./scripts/start-lmstudio-ngrok.sh
```

The script checks that LM Studio is reachable locally before starting ngrok.

To run ngrok detached in a `screen` session:

```bash
./scripts/start-lmstudio-ngrok-detached.sh
```

Check the detached session:

```bash
screen -ls
```

Stop the detached tunnel:

```bash
screen -S lmstudio-ngrok -X quit
```

Start the LM Studio server on:

```txt
http://localhost:1234
```

Start ngrok:

```bash
ngrok http 1234
```

Copy the HTTPS forwarding URL, for example:

```txt
https://abc123.ngrok-free.app
```

Set backend Vercel env:

```env
LM_STUDIO_API_URL=https://abc123.ngrok-free.app/v1/chat/completions
```

Redeploy the backend.

Test:

```bash
curl https://abc123.ngrok-free.app/v1/models
```

## Backend Vercel Env Vars

Backend project needs:

```env
MONGO_URL=mongodb+srv://...
MONGO_DB_NAME=reality_hits
JWT_SECRET=<long-random-secret>
DEBUG=False
LM_STUDIO_API_URL=https://<tunnel-host>/v1/chat/completions
GEMINI_API_KEY=<google-ai-studio-key>
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/openai/chat/completions
```

Frontend project needs:

```env
VITE_API_URL=https://<backend-vercel-project>.vercel.app
```

Redeploy each Vercel project after changing its env vars.

## Validation Checklist

1. LM Studio is running and model is loaded.
2. Local test works:

```bash
curl http://localhost:1234/v1/models
```

3. Public tunnel test works:

```bash
curl https://<tunnel-host>/v1/models
```

4. Backend health works:

```bash
curl https://<backend-vercel-project>.vercel.app/api/health
```

5. Submit a complaint from the deployed frontend.
6. Check Vercel backend logs:
   - If LM Studio works, logs should show an LM Studio response.
   - If LM Studio fails, logs should show Gemini fallback.
   - If both fail, the complaint should still save with manual review.

## Security Notes

Do not expose the tunnel URL publicly in frontend code. Only the backend should call it.

For a hackathon demo, a public tunnel is acceptable. For anything beyond a demo, add protection:

- Use Cloudflare Access in front of the hostname.
- Add a shared secret header requirement at the tunnel/proxy layer if available.
- Restrict usage/rate limits.
- Keep Gemini fallback enabled.
- Do not expose MongoDB from the local machine; use MongoDB Atlas.

## Troubleshooting

`curl http://localhost:1234/v1/models` fails:

- LM Studio server is not running.
- No model is loaded.
- Server is using a different port.

Public tunnel URL works in browser but Vercel fails:

- Confirm `LM_STUDIO_API_URL` includes `/v1/chat/completions`.
- Redeploy backend after env change.
- Check Vercel function logs for non-200 or timeout.

Complaints save but category is `Other` and confidence is `0`:

- Both LM Studio and Gemini failed.
- Check `GEMINI_API_KEY` and tunnel URL.

Vercel backend function times out:

- Use a smaller/faster LM Studio model.
- Keep Gemini fallback configured.
- Confirm local upload speed and machine performance are adequate.

## Sources

- Cloudflare Tunnel setup: https://developers.cloudflare.com/tunnel/setup/
- Cloudflare locally-managed tunnels: https://developers.cloudflare.com/tunnel/advanced/local-management/
- ngrok secure tunnels: https://ngrok.com/docs/guides/share-localhost/tunnels
- ngrok HTTP endpoints: https://ngrok.com/docs/http/
