# Deployment Guide - Reality Hits

## Production Checklist

- [ ] Set up MongoDB Atlas (or production MongoDB instance)
- [ ] Configure LM Studio on production server
- [ ] Set up environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for specific domains
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring
- [ ] Set up CI/CD pipeline
- [ ] Configure backups
- [ ] Set up error tracking (Sentry)

---

## Backend Deployment

### Option 1: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Create Procfile**
```bash
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
```

2. **Initialize Git (if not already)**
```bash
git init
git add .
git commit -m "Initial commit"
```

3. **Create Heroku app**
```bash
heroku create reality-hits-api
```

4. **Set environment variables**
```bash
heroku config:set MONGO_URL=your_mongodb_atlas_url
heroku config:set LM_STUDIO_API_URL=http://your-lm-studio:1234/v1/chat/completions
heroku config:set DEBUG=False
```

5. **Deploy**
```bash
git push heroku main
```

6. **View logs**
```bash
heroku logs --tail
```

### Option 2: Railway

#### Steps

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect GitHub to Railway**
- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Select this repository

3. **Configure environment variables**
- Add `MONGO_URL`
- Add `LM_STUDIO_API_URL`
- Add `DEBUG=False`

4. **Deploy automatically on push**

---

### Option 3: AWS EC2

#### Steps

1. **Launch EC2 instance**
   - Ubuntu 22.04 LTS
   - T3 medium or larger
   - Security group: Allow ports 80, 443, 8000

2. **SSH into instance**
```bash
ssh -i key.pem ubuntu@your-instance-ip
```

3. **Install dependencies**
```bash
sudo apt update
sudo apt install python3-pip python3-venv mongodb nginx
```

4. **Clone repository**
```bash
git clone your-repo-url
cd Reality\ Hits\ Project/backend
```

5. **Setup virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

6. **Configure .env**
```bash
cp .env.example .env
nano .env  # Edit with your settings
```

7. **Setup Gunicorn**
```bash
pip install gunicorn
```

8. **Create systemd service**
```bash
sudo nano /etc/systemd/system/reality-hits-api.service
```

Add:
```ini
[Unit]
Description=Reality Hits API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/Reality\ Hits\ Project/backend
Environment="PATH=/home/ubuntu/Reality\ Hits\ Project/backend/venv/bin"
ExecStart=/home/ubuntu/Reality\ Hits\ Project/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:8000 main:app

[Install]
WantedBy=multi-user.target
```

9. **Start service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable reality-hits-api
sudo systemctl start reality-hits-api
```

10. **Setup Nginx reverse proxy**
```bash
sudo nano /etc/nginx/sites-available/reality-hits
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

11. **Enable site**
```bash
sudo ln -s /etc/nginx/sites-available/reality-hits /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Frontend Deployment

### Option 1: Vercel

#### Steps

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Import project from GitHub
- Select frontend folder

3. **Configure environment variables**
- `VITE_API_URL`: Your backend URL

4. **Deploy automatically on push**

### Option 2: Netlify

#### Steps

1. **Build frontend**
```bash
cd frontend
npm run build
```

2. **Connect to Netlify**
- Go to https://app.netlify.com
- Drag and drop `dist` folder
- Or connect GitHub for auto-deploy

3. **Configure redirects** (create `netlify.toml`)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: AWS S3 + CloudFront

#### Steps

1. **Create S3 bucket**
```bash
aws s3 mb s3://reality-hits-frontend
```

2. **Build and upload**
```bash
npm run build
aws s3 sync dist/ s3://reality-hits-frontend --delete
```

3. **Configure CloudFront distribution**
- Origin: S3 bucket
- Redirect HTTP to HTTPS
- Cache policy: Optimized

---

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create account** at https://www.mongodb.com/cloud/atlas
2. **Create project and cluster**
3. **Get connection string**
4. **Update backend `.env`**
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Self-hosted MongoDB

1. **Install MongoDB**
2. **Enable authentication**
3. **Create database and user**
```bash
mongosh
use reality_hits
db.createUser({user: "admin", pwd: "password", roles: ["readWrite"]})
```

4. **Configure firewall**
5. **Enable backups**

---

## SSL/HTTPS

### Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
sudo nginx -t && sudo systemctl reload nginx
```

### Auto-renewal
```bash
sudo certbot renew --dry-run
```

---

## Environment Variables (Production)

### Backend
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/reality_hits
MONGO_DB_NAME=reality_hits
LM_STUDIO_API_URL=http://internal-lm-studio:1234/v1/chat/completions
DEBUG=False
```

### Frontend
```env
VITE_API_URL=https://api.your-domain.com
```

---

## Monitoring & Logging

### Setup Sentry (Error Tracking)

1. **Create Sentry account**
2. **Install SDK**
```bash
pip install sentry-sdk
```

3. **Configure in main.py**
```python
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

### Log Aggregation

Use ELK Stack or Datadog for log aggregation.

---

## Performance Optimization

### Backend
- Enable compression
- Set appropriate cache headers
- Use connection pooling
- Optimize database indexes

### Frontend
- Enable gzip compression
- Minimize bundle size
- Use CDN
- Lazy load images

---

## Backup Strategy

### MongoDB
```bash
# Automated daily backups
0 2 * * * mongodump --uri="your-connection-string" --out=/backups/$(date +\%Y\%m\%d)
```

### Application Code
- Use GitHub with branch protection
- Tag releases
- Maintain changelog

---

## Scaling

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Database read replicas

### Vertical Scaling
- Upgrade instance size
- Increase memory/CPU

---

## Security Checklist

- [ ] Enable HTTPS only
- [ ] Set CORS headers properly
- [ ] Implement rate limiting
- [ ] Add authentication/authorization
- [ ] Use environment variables for secrets
- [ ] Enable database authentication
- [ ] Regular security updates
- [ ] SQL injection prevention (use parameterized queries)
- [ ] CSRF protection
- [ ] XSS prevention

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
heroku logs --tail
# or
journalctl -u reality-hits-api -f
```

### Database connection error
```bash
# Test connection
mongosh "your-connection-string"
```

### Frontend not connecting to backend
- Check CORS settings
- Verify `VITE_API_URL` environment variable
- Check network tab in browser DevTools

---

## Support

For issues or questions:
1. Check application logs
2. Review API documentation
3. Test endpoints with cURL
4. Use Swagger UI for debugging

