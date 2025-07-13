# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying the Point Ranking System to production using Vercel (frontend), Render (backend), and MongoDB Atlas (database).

## 📋 Prerequisites

- GitHub account
- Vercel account
- Render account
- MongoDB Atlas account
- Node.js installed locally

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email address

### 1.2 Create a Cluster
1. Click "Create a Cluster"
2. Choose "Shared" (free tier)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "ranking-system")
5. Click "Create Cluster"

### 1.3 Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with "ranking-system"

Example:
\`\`\`
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ranking-system?retryWrites=true&w=majority
\`\`\`

## 🖥️ Step 2: Backend Deployment (Render)

### 2.1 Prepare Repository
1. Push your code to GitHub
2. Ensure your `server` folder contains all backend files

### 2.2 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up and connect your GitHub account

### 2.3 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `ranking-system-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.4 Set Environment Variables
In the Render dashboard, add these environment variables:

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ranking-system?retryWrites=true&w=majority
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-app-name.vercel.app
\`\`\`

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your Render URL (e.g., `https://ranking-system-api.onrender.com`)

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Prepare Client
1. Update `client/src/config/api.js` with your Render URL:
\`\`\`javascript
production: {
  API_BASE_URL: "https://your-render-app.onrender.com",
  SOCKET_URL: "https://your-render-app.onrender.com",
}
\`\`\`

### 3.2 Deploy to Vercel

#### Option A: Vercel CLI
1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Navigate to client folder:
\`\`\`bash
cd client
\`\`\`

3. Login to Vercel:
\`\`\`bash
vercel login
\`\`\`

4. Deploy:
\`\`\`bash
vercel --prod
\`\`\`

#### Option B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.3 Set Environment Variables in Vercel
Add these environment variables in Vercel dashboard:

\`\`\`
REACT_APP_API_URL=https://your-render-app.onrender.com
REACT_APP_SOCKET_URL=https://your-render-app.onrender.com
REACT_APP_ENV=production
\`\`\`

### 3.4 Update Backend CORS
Update your Render environment variables with the Vercel URL:
\`\`\`
CLIENT_URL=https://your-vercel-app.vercel.app
\`\`\`

## 🔧 Step 4: Final Configuration

### 4.1 Test the Deployment
1. Visit your Vercel URL
2. Try adding a user
3. Try claiming points
4. Check real-time updates

### 4.2 Monitor Logs
- **Render**: Check logs in Render dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **MongoDB**: Monitor in Atlas dashboard

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: 
- Verify `CLIENT_URL` in Render environment variables
- Check that it matches your Vercel URL exactly

#### 2. Database Connection Failed
**Problem**: Backend can't connect to MongoDB
**Solution**:
- Verify MongoDB connection string
- Check database user credentials
- Ensure network access allows all IPs

#### 3. Socket.io Connection Issues
**Problem**: Real-time updates not working
**Solution**:
- Verify `REACT_APP_SOCKET_URL` matches Render URL
- Check that Socket.io is properly configured for production

#### 4. Build Failures
**Problem**: Deployment fails during build
**Solution**:
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for any missing environment variables

### Environment Variables Checklist

**Render (Backend):**
- ✅ `MONGODB_URI`
- ✅ `PORT` (usually 10000)
- ✅ `NODE_ENV=production`
- ✅ `CLIENT_URL` (your Vercel URL)

**Vercel (Frontend):**
- ✅ `REACT_APP_API_URL` (your Render URL)
- ✅ `REACT_APP_SOCKET_URL` (your Render URL)
- ✅ `REACT_APP_ENV=production`

## 📊 Performance Optimization

### Backend (Render)
1. Enable compression middleware
2. Implement caching strategies
3. Optimize database queries
4. Use connection pooling

### Frontend (Vercel)
1. Enable automatic optimizations
2. Use Vercel Analytics
3. Implement code splitting
4. Optimize images and assets

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure specific origins in production
3. **Rate Limiting**: Implement API rate limiting
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Ensure all connections use HTTPS

## 📈 Monitoring & Analytics

### Render Monitoring
- Check service health
- Monitor response times
- Review error logs
- Set up alerts

### Vercel Analytics
- Enable Vercel Analytics
- Monitor Core Web Vitals
- Track user interactions
- Review performance metrics

### MongoDB Atlas Monitoring
- Monitor database performance
- Set up alerts for high usage
- Review slow queries
- Track connection metrics

## 🔄 Continuous Deployment

### Automatic Deployments
1. **Vercel**: Automatically deploys on git push to main branch
2. **Render**: Automatically deploys on git push to main branch

### Manual Deployments
1. **Vercel**: Use `vercel --prod` command
2. **Render**: Trigger manual deploy in dashboard

## 📝 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database connection works
- [ ] User registration works
- [ ] Point claiming works
- [ ] Real-time updates work
- [ ] Mobile responsiveness
- [ ] Error handling works
- [ ] Performance is acceptable
- [ ] Security headers are set

## 🎉 Success!

Your Point Ranking System is now live! 

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-api.onrender.com
- **Database**: MongoDB Atlas cluster

Remember to:
1. Monitor your applications regularly
2. Keep dependencies updated
3. Backup your database
4. Monitor usage and costs
5. Implement additional features as needed

---

**Need help?** Check the main README.md for troubleshooting tips or create an issue in the repository.
