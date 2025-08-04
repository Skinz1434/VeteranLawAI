# VeteranLawAI Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Account on deployment platform (Vercel, Netlify, or AWS)

## Environment Variables

Copy `.env.example` to `.env` and fill in all required values:

```bash
cp .env.example .env
```

### Required Environment Variables:

- **Authentication**:
  - `VITE_AUTH_DOMAIN`: Your Auth0/authentication domain
  - `VITE_AUTH_CLIENT_ID`: OAuth client ID
  - `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

- **API Configuration**:
  - `VITE_API_BASE_URL`: Backend API endpoint
  - `VITE_OCR_API_ENDPOINT`: OCR service endpoint
  - `VITE_OCR_API_KEY`: OCR service API key

- **AI/LLM**:
  - `VITE_OPENAI_API_KEY`: OpenAI API key for AI features

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts to configure project

4. Set environment variables in Vercel dashboard

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

3. Set environment variables in Netlify dashboard

### Option 3: AWS Amplify

1. Connect GitHub repository to AWS Amplify
2. Configure build settings (already in `amplify.yml`)
3. Set environment variables in AWS Amplify console
4. Deploy automatically on push

### Option 4: Custom Server (Nginx)

1. Build the application:
```bash
npm run build
```

2. Copy `dist` folder to server

3. Nginx configuration:
```nginx
server {
    listen 80;
    server_name veteranlawai.com;
    root /var/www/veteranlawai/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass https://api.veteranlawai.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flow
- [ ] Check OCR functionality
- [ ] Verify API connections
- [ ] Test file upload features
- [ ] Monitor health check endpoint (`/health`)
- [ ] Set up monitoring/alerts
- [ ] Configure SSL certificate
- [ ] Enable CDN for static assets
- [ ] Set up backup strategy

## Security Considerations

1. **API Keys**: Never commit API keys to repository
2. **CORS**: Configure proper CORS settings on backend
3. **CSP**: Content Security Policy is configured in deployment files
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Implement rate limiting on API endpoints

## Monitoring

- Health check available at `/health` or `/status`
- Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- Configure error tracking (e.g., Sentry)
- Monitor API usage and limits

## Troubleshooting

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Runtime Errors
- Check browser console for errors
- Verify all environment variables are set
- Check network tab for failed API requests

### Performance Issues
- Enable Vite's build optimizations
- Use CDN for static assets
- Implement lazy loading for routes
- Monitor bundle size with `npm run build`

## Support

For deployment support:
- Email: support@veteranlawai.com
- Documentation: [docs.veteranlawai.com](https://docs.veteranlawai.com)
- GitHub Issues: [github.com/veteranlawai/platform](https://github.com/veteranlawai/platform)