# AWS Deployment Guide

This project deploys as:

- Frontend: Vite static build uploaded to Amazon S3
- Backend: Node/Express API running on Amazon EC2
- Database: MongoDB Atlas or another reachable MongoDB URI

## 1. Production values to decide first

Replace these examples with your real values:

```bash
FRONTEND_URL=http://your-bucket-name.s3-website-your-region.amazonaws.com
API_URL=http://your-ec2-public-ip:5000/api/v1
EC2_PUBLIC_IP=your-ec2-public-ip
AWS_REGION=ap-south-1
S3_BUCKET=your-unique-frontend-bucket-name
```

For a custom HTTPS setup, use:

```bash
FRONTEND_URL=https://academy.yourdomain.com
API_URL=https://api.yourdomain.com/api/v1
```

## 2. Backend EC2 setup

Launch an EC2 Ubuntu instance and open inbound rules:

- SSH: `22` from your IP only
- API direct mode: `5000` from `0.0.0.0/0`
- Recommended domain mode: `80` and `443`, then proxy to Node with Nginx

SSH into the server:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Install Node.js, Git, and PM2:

```bash
sudo apt update
sudo apt install -y git curl build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Clone/copy the project:

```bash
git clone YOUR_REPO_URL career-ai
cd career-ai/backend
npm ci
```

Create production env:

```bash
cp .env.example .env
nano .env
```

Use values like:

```bash
NODE_ENV=production
PORT=5000
API_VERSION=v1
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/career-ai
JWT_SECRET=replace_with_long_random_secret_at_least_32_chars
CORS_ORIGINS=http://your-bucket-name.s3-website-your-region.amazonaws.com,https://academy.yourdomain.com
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=your_api_key
EMAIL_FROM_ADDRESS=academy@solvagence.com
```

Seed once if the production database is empty:

```bash
npm run seed
```

Start with PM2:

```bash
pm2 start src/server.js --name career-ai-api
pm2 save
pm2 startup
```

Test:

```bash
curl http://localhost:5000/health
curl http://YOUR_EC2_PUBLIC_IP:5000/health
```

## 3. Optional Nginx reverse proxy

Use this if you want `https://api.yourdomain.com` instead of `http://IP:5000`.

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/career-ai-api
```

Config:

```nginx
server {
  listen 80;
  server_name api.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/career-ai-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

For HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

Then set frontend `VITE_API_BASE_URL=https://api.yourdomain.com/api/v1`.

## 4. Frontend build for S3

On your local machine:

```bash
cd frontend
cp .env.example .env.production
```

Set:

```bash
VITE_API_BASE_URL=http://YOUR_EC2_PUBLIC_IP:5000/api/v1
VITE_APP_URL=http://your-bucket-name.s3-website-your-region.amazonaws.com
```

Or, with HTTPS/domain:

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_APP_URL=https://academy.yourdomain.com
```

Build:

```bash
npm ci
npm run build
```

## 5. S3 static website setup

Create a bucket:

```bash
aws s3 mb s3://YOUR_BUCKET_NAME --region YOUR_REGION
```

Enable static website hosting:

```bash
aws s3 website s3://YOUR_BUCKET_NAME --index-document index.html --error-document index.html
```

For public S3 website hosting, allow public read access. Bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

Upload the build:

```bash
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
```

Your S3 website URL will look like:

```text
http://YOUR_BUCKET_NAME.s3-website-YOUR_REGION.amazonaws.com
```

## 6. Required CORS alignment

Backend `.env` must include the exact frontend origin:

```bash
CORS_ORIGINS=http://YOUR_BUCKET_NAME.s3-website-YOUR_REGION.amazonaws.com
```

If you later use CloudFront/custom domain, add those too:

```bash
CORS_ORIGINS=http://YOUR_BUCKET_NAME.s3-website-YOUR_REGION.amazonaws.com,https://academy.yourdomain.com
```

Restart backend after changing env:

```bash
pm2 restart career-ai-api --update-env
```

## 7. Smoke tests after deployment

Backend:

```bash
curl http://YOUR_EC2_PUBLIC_IP:5000/health
curl "http://YOUR_EC2_PUBLIC_IP:5000/api/v1/tracks?locale=en"
```

Frontend:

- Open S3 website URL
- Click `View Programmes`
- Switch EN/AR
- Open `Explore Track`
- Test enrollment pricing
- Check footer links: Privacy, Terms, Refund Policy, Group Enrollment

## 8. Redeploy after changes

Backend:

```bash
cd ~/career-ai
git pull
cd backend
npm ci
pm2 restart career-ai-api --update-env
```

Frontend:

```bash
cd frontend
npm ci
npm run build
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
```

## Notes

- For a pure S3 website endpoint, use `index.html` as both index and error document so React Router routes such as `/terms` work.
- For production HTTPS, prefer CloudFront in front of S3 and Nginx/Certbot or a load balancer in front of EC2.
- MongoDB Atlas network access must allow the EC2 public IP, or the backend cannot connect.
