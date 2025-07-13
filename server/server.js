const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const http = require("http")
const socketIo = require("socket.io")
require("dotenv").config()

const app = express()
const server = http.createServer(app)

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// CORS configuration for production
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      "http://localhost:3000",
      "https://ranking-system-ivory.vercel.app",
      process.env.CLIENT_URL,
    ].filter(Boolean)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      const allowedOrigins = [
        "http://localhost:3000",
        "https://ranking-system-ivory.vercel.app",
        process.env.CLIENT_URL,
      ].filter(Boolean)

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

// Import models
const User = require("./models/User")
const PointsHistory = require("./models/PointsHistory")

// Import routes
const userRoutes = require("./routes/users")
const pointsRoutes = require("./routes/points")

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use("/api/users", userRoutes)
app.use("/api/points", pointsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🏆 Point Ranking System API",
    version: "1.0.0",
    status: "Running",
    endpoints: {
      users: "/api/users",
      points: "/api/points",
      health: "/api/health",
    },
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Initialize default users
const initializeUsers = async () => {
  try {
    const userCount = await User.countDocuments()
    if (userCount === 0) {
      const defaultUsers = [
        { name: "Rahul", totalPoints: 0 },
        { name: "Kamal", totalPoints: 0 },
        { name: "Sanak", totalPoints: 0 },
        { name: "Priya", totalPoints: 0 },
        { name: "Amit", totalPoints: 0 },
        { name: "Sneha", totalPoints: 0 },
        { name: "Ravi", totalPoints: 0 },
        { name: "Pooja", totalPoints: 0 },
        { name: "Vikram", totalPoints: 0 },
        { name: "Anita", totalPoints: 0 },
      ]

      await User.insertMany(defaultUsers)
      console.log("✅ Default users created successfully")
    }
  } catch (error) {
    console.error("❌ Error initializing users:", error)
  }
}

const PORT = process.env.PORT || 5000

// Start server
const startServer = async () => {
  await connectDB()
  await initializeUsers()

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  })
}

startServer()

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("Process terminated")
  })
})
