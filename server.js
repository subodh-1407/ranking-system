const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")
require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ranking-system", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Points History Schema
const pointsHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  pointsAwarded: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model("User", userSchema)
const PointsHistory = mongoose.model("PointsHistory", pointsHistorySchema)

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
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
      console.log("Default users created")
    }
  } catch (error) {
    console.error("Error initializing users:", error)
  }
}

// Routes

// Get all users with rankings
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 })
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))
    res.json(usersWithRank)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add new user
app.post("/api/users", async (req, res) => {
  try {
    const { name } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ name })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const newUser = new User({ name })
    await newUser.save()

    // Emit updated rankings to all clients
    const users = await User.find().sort({ totalPoints: -1 })
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))
    io.emit("rankingsUpdated", usersWithRank)

    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Claim points for a user
app.post("/api/claim-points", async (req, res) => {
  try {
    const { userId } = req.body

    // Generate random points between 1 and 10
    const pointsAwarded = Math.floor(Math.random() * 10) + 1

    // Update user's total points
    const user = await User.findByIdAndUpdate(userId, { $inc: { totalPoints: pointsAwarded } }, { new: true })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Create points history record
    const historyRecord = new PointsHistory({
      userId: user._id,
      userName: user.name,
      pointsAwarded,
    })
    await historyRecord.save()

    // Get updated rankings
    const users = await User.find().sort({ totalPoints: -1 })
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))

    // Emit updated rankings to all clients
    io.emit("rankingsUpdated", usersWithRank)

    res.json({
      user,
      pointsAwarded,
      newTotalPoints: user.totalPoints,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get points history
app.get("/api/points-history", async (req, res) => {
  try {
    const history = await PointsHistory.find().sort({ timestamp: -1 }).limit(50)
    res.json(history)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 5000

// Initialize database and start server
mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB")
  await initializeUsers()

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
