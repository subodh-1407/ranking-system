# 🏆 Point Ranking System

A full-stack web application that allows users to claim random points and compete on a dynamic leaderboard. Built with React.js frontend, Node.js/Express backend, and MongoDB database.

## 📱 Features

- **User Management**: Add new users and manage existing ones
- **Point Claiming**: Award random points (1-10) to selected users
- **Real-time Rankings**: Dynamic leaderboard with live updates using Socket.io
- **Points History**: Track all point claiming activities with timestamps
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Production Ready**: Configured for deployment on Vercel and Render

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client with interceptors
- **React Toastify** - User notifications
- **CSS3** - Custom styling with animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### Database
- **MongoDB Atlas** - Cloud database
- **Collections**: Users, PointsHistory
- **Indexing** - Optimized queries

## 📁 Project Structure

\`\`\`
ranking-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # Configuration files
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── server.js           # Main server file
│   └── package.json
├── package.json            # Root package.json
└── README.md
\`\`\`

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd ranking-system
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
\`\`\`

### 3. Environment Configuration

#### Server Environment (.env in server folder)
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ranking-system?retryWrites=true&w=majority
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

#### Client Environment (.env in client folder)
\`\`\`env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
\`\`\`

### 4. MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get connection string
5. Replace `MONGODB_URI` in server `.env`

### 5. Run Development Server
\`\`\`bash
# Run both client and server
npm run dev

# Or run separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
\`\`\`

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Prepare for deployment:**
   \`\`\`bash
   cd client
   npm run build
   \`\`\`

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`
   - Or connect GitHub repo to Vercel dashboard

3. **Environment Variables in Vercel:**
   \`\`\`
   REACT_APP_API_URL=https://your-render-app.onrender.com
   REACT_APP_SOCKET_URL=https://your-render-app.onrender.com
   REACT_APP_ENV=production
   \`\`\`

### Backend Deployment (Render)

1. **Create Render account** and connect GitHub

2. **Create Web Service:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables in Render:**
   \`\`\`
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ranking-system
   PORT=10000
   CLIENT_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   \`\`\`

4. **Update CORS settings** in server after deployment

### Database Setup (MongoDB Atlas)

1. **Create Cluster:**
   - Choose free tier
   - Select region closest to your users

2. **Database Access:**
   - Create database user
   - Set username/password

3. **Network Access:**
   - Add IP addresses (0.0.0.0/0 for all IPs)

4. **Connect:**
   - Get connection string
   - Replace in environment variables

## 📋 API Endpoints

### Users
- `GET /api/users` - Get all users with rankings
- `POST /api/users` - Add a new user
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Soft delete user

### Points
- `POST /api/points/claim` - Claim random points for a user
- `GET /api/points/history` - Get points claiming history
- `GET /api/points/stats` - Get points statistics

### Health
- `GET /api/health` - Health check endpoint

## 🗄️ Database Schema

### User Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String (required, unique, 2-50 chars),
  totalPoints: Number (default: 0, min: 0),
  avatar: String (default: ''),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Points History Collection
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  userName: String (required),
  pointsAwarded: Number (1-10),
  timestamp: Date (default: Date.now),
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🎯 Features Overview

### Real-time Updates
- Socket.io integration for live leaderboard updates
- Instant ranking changes after point claims
- Real-time notifications for all connected users

### Mobile-First Design
- Responsive layout for all screen sizes
- Touch-friendly interface elements
- Optimized for mobile performance

### Error Handling
- React Error Boundaries
- API error handling with user feedback
- Loading states and error messages

### Security Features
- Helmet.js for security headers
- Rate limiting for API endpoints
- Input validation and sanitization
- CORS configuration

## 🔧 Development Scripts

\`\`\`bash
# Root level
npm run dev          # Run both client and server
npm run client       # Run client only
npm run server       # Run server only
npm run install-all  # Install all dependencies

# Client level
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests

# Server level
npm start          # Start production server
npm run dev        # Start development server with nodemon
\`\`\`

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check connection string format
   - Verify database user credentials
   - Ensure IP whitelist includes your IP

2. **CORS Error:**
   - Update `CLIENT_URL` in server environment
   - Check Vercel deployment URL

3. **Socket.io Connection Issues:**
   - Verify `SOCKET_URL` in client environment
   - Check Render service URL

4. **Build Errors:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Environment Variables Checklist

**Server (.env):**
- ✅ MONGODB_URI
- ✅ PORT
- ✅ CLIENT_URL
- ✅ NODE_ENV

**Client (.env):**
- ✅ REACT_APP_API_URL
- ✅ REACT_APP_SOCKET_URL
- ✅ REACT_APP_ENV

## 🎨 UI Components

### Header
- Gradient background with floating animations
- App title and subtitle

### Top Three Podium
- Medal-style ranking display
- User avatars with initials
- Animated hover effects

### User Selection
- Dropdown for user selection
- Point claiming button with loading state
- Action buttons for add user and history

### Leaderboard
- Ranked list with user details
- Trophy icons based on ranking
- Smooth animations and transitions

### Modals
- Add user form with validation
- Points history with timestamps
- Responsive design with backdrop

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Achievement system and badges
- [ ] Daily/weekly/monthly leaderboards
- [ ] Point multipliers and special events
- [ ] User avatars and customization
- [ ] Export leaderboard data
- [ ] Admin panel for user management
- [ ] Push notifications
- [ ] Social sharing features

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review environment variables
3. Check server logs in Render dashboard
4. Verify MongoDB Atlas connection

---

**Happy Coding! 🚀**
#   r a n k i n g - s y s t e m  
 