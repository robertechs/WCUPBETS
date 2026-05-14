# Vercel Deployment Guide for HiveBets

This guide will walk you through deploying your HiveBets application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works fine)
- Node.js installed on your computer
- Your HiveBets project ready to deploy

## Step 1: Prepare Your Project

1. **Make sure all dependencies are installed:**
   ```bash
   npm install
   ```

2. **Test your build locally:**
   ```bash
   npm run build
   ```

3. **Ensure your project builds without errors**

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   cd /path/to/your/project
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `hivebets`
   - In which directory is your code located? `./`
   
4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Drag & Drop

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `hivebets`
   - In which directory is your code located? `./`
   
4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables (if needed)

If your project uses environment variables:

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables:
   - Click **"Add New"**
   - Enter the key-value pairs
   - Select environments (Production, Preview, Development)
   - Click **"Save"**

Common environment variables for Web3 apps:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_RPC_URL=your_rpc_url
```

## Step 4: Custom Domain (Optional)

1. Go to your project on Vercel
2. Navigate to **Settings** → **Domains**
3. Click **"Add"**
4. Enter your custom domain
5. Follow the DNS configuration instructions

## Step 5: Deploy Facilitator Services

The facilitator services need to be deployed separately:

### Facilitator Deployment Options:

1. **Vercel CLI (Recommended)**
   ```bash
   cd facilitator
   vercel --prod
   ```

2. **Railway.app**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from Local"
   - Select your facilitator folder
   - Add environment variables
   - Deploy

3. **Render.com**
   - Go to [render.com](https://render.com)
   - New Web Service
   - Upload your facilitator folder
   - Configure and deploy

4. **Heroku**
   ```bash
   cd facilitator
   heroku create hivebets-facilitator
   git init
   git add .
   git commit -m "Deploy facilitator"
   heroku git:remote -a hivebets-facilitator
   git push heroku main
   ```

## Redeploying Updates

To redeploy after making changes:

**Via CLI:**
```bash
vercel --prod
```

**Via Dashboard:**
1. Go to your project on Vercel
2. Click **"Redeploy"** from the Deployments tab

**Via Drag & Drop:**
- Simply drag your updated project folder again

## Troubleshooting

### Build Errors

If you get build errors:

1. Check your build logs on Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Next.js version compatibility
4. Check for TypeScript errors

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Clear build cache if needed

### Deployment Taking Too Long

- Check if you're using `--turbopack` in build (remove for production)
- Optimize your build by removing unused dependencies
- Consider using `output: 'standalone'` in `next.config.ts`

## Monitoring Your Deployment

1. **Analytics**: Enable Vercel Analytics in project settings
2. **Logs**: View real-time logs in the Vercel dashboard
3. **Performance**: Use Vercel Speed Insights

## Updating Your Deployment

To update your deployment with new changes:

```bash
# Navigate to your project
cd /path/to/your/project

# Deploy the updates
vercel --prod
```

The new version will be live in minutes.

## Rollback

If you need to rollback:

1. Go to Vercel Dashboard
2. Navigate to **Deployments**
3. Find the previous working deployment
4. Click the three dots menu
5. Select **"Promote to Production"**

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Custom domain set up (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Remove console.logs and debug code
- [ ] Test all functionality on preview deployment
- [ ] Configure CORS if using external APIs
- [ ] Set up monitoring and error tracking
- [ ] Verify wallet connection works
- [ ] Test on multiple devices/browsers

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Discord](https://vercel.com/discord)

---

## Quick Start Command

The fastest way to deploy:

```bash
npm i -g vercel && vercel --prod
```

Good luck with your deployment! 🚀

