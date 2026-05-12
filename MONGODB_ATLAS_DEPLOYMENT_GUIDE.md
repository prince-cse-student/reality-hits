# MongoDB Atlas Deployment Guide (Option A)

Ye guide MongoDB ko **MongoDB Atlas (managed MongoDB)** par deploy/host karne aur apne server/app se connect karne ke liye hai (production-friendly).

---

## Requirements

- MongoDB Atlas account
- Aapka app server (VPS/EC2/etc.) ka **public IP**
- App me env vars set karne ka access (PM2/Docker/Systemd)

---

## Step 1: Atlas Project banao

1. MongoDB Atlas dashboard me login karo.
2. **New Project** create karo (project name set karke).

---

## Step 2: Cluster create karo

1. **Build a Database** par jao.
2. **Dedicated** choose karo (production ke liye usually **M10+** recommended).
3. Cloud provider + region: apne server ke nearest region choose karo (latency kam).
4. Cluster name set karo → **Create**.

---

## Step 3: Database User banao (username/password)

1. **Security → Database Access** me jao.
2. **Add New Database User**
3. Method: **Password**
4. Username set karo.
5. Strong password set karo.
6. Role (simple): **Read and write to any database**
   - Advanced (recommended later): sirf specific DB pe permissions
7. Save.

> Tip: App ke liye **separate user** banao. Admin/root type user app me use mat karo.

---

## Step 4: Network Access (IP Whitelist)

1. **Security → Network Access**
2. **Add IP Address**
3. Recommended: **aapke server ka public IP/32** add karo.

### Server ka public IP kaise nikaalein

Server par run:

```bash
curl -s ifconfig.me
```

> Warning: Testing ke liye `0.0.0.0/0` open karna avoid karo (security risk). Temporary karna pade to baad me remove zaroor karo.

---

## Step 5: Connection String (MongoDB URI) copy karo

1. Cluster page par jao → **Connect**
2. **Drivers** choose karo
3. Driver (Node.js / Python / etc.) select karo
4. URI copy karo. Format kuch aisa hoga:

```txt
mongodb+srv://<user>:<password>@<cluster-host>/<db>?retryWrites=true&w=majority
```

### URI me kya fill karna hai

- `<user>` = Step 3 wala username
- `<password>` = Step 3 wala password
- `<db>` = aapka database name (example: `realityhits`)

### Password me special characters?

Best: password me `@ : / ? # &` jaise characters avoid karo.
Agar already hain, to password ko **URL-encode** karna padega.

---

## Step 6: App Server par `MONGODB_URI` set karo

Niche apne deployment method ke hisaab se follow karo.

### A) PM2 (Node.js)

1. Env set (example `.env`):

```bash
MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/realityhits?retryWrites=true&w=majority"
```

2. Restart:

```bash
pm2 restart all
```

### B) Docker Compose

`docker-compose.yml` me app service ke under:

```yaml
environment:
  - MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/realityhits?retryWrites=true&w=majority
```

Redeploy:

```bash
docker compose up -d --build
```

### C) Systemd service

1. Service file me env add karo (example):

```ini
Environment="MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/realityhits?retryWrites=true&w=majority"
```

2. Reload + restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart <your-service-name>
```

---

## Step 7: Server se quick connection test

### Option 1: `mongosh` (agar installed hai)

```bash
mongosh "mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/realityhits"
```

### Option 2: Node.js one-liner (MongoDB driver required)

```bash
node -e "require('mongodb').MongoClient.connect(process.env.MONGODB_URI).then(()=>console.log('ok')).catch(e=>{console.error(e);process.exit(1)})"
```

> Is command se pehle `MONGODB_URI` env set hona chahiye.

---

## Common Issues (quick fixes)

### 1) IP not allowed / connection timeout
- Atlas **Network Access** me aapka server IP add nahi hai ya change ho gaya hai.
- Fix: server ka current IP nikaal ke `/32` ke saath add karo.

### 2) Authentication failed
- Username/password galat hai.
- Password me special chars hain aur URL-encoding missing hai.
- Fix: password reset karo (safe chars) ya URL-encode use karo.

### 3) Wrong database name / app fails to boot
- URI me `<db>` wrong hai.
- Fix: correct DB name set karo (Atlas me create karna optional hai; app bhi create kar sakti hai).

---

## Production Checklist

- `0.0.0.0/0` remove karke sirf server IP allow rakho
- App ke liye separate DB user
- Backups enabled (M10+ plans me options hoti hain)
- Monitoring/alerts basic enable
- Secrets ko `.env`/secret manager me rakho, git me commit mat karo

---

## Next (optional)

Agar aap bata do:
- app Node hai ya Python?
- deploy PM2 hai ya Docker?

to main aapke repo ke hisaab se exact config file (paths + env var names) align karke guide ko tailor kar dunga.
