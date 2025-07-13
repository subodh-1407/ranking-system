const express = require("express")
const router = express.Router()
const User = require("../models/User")

/**
 * @route   GET /api/users
 * @desc    Get all users with rankings
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).sort({ totalPoints: -1 })

    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))

    res.json({
      success: true,
      count: usersWithRank.length,
      data: usersWithRank,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    })
  }
})

/**
 * @route   POST /api/users
 * @desc    Add new user
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "Name must be at least 2 characters long",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this name already exists",
      })
    }

    const newUser = new User({ name: name.trim() })
    await newUser.save()

    // Get updated rankings and emit to all clients
    const users = await User.find({ isActive: true }).sort({ totalPoints: -1 })
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))

    req.io.emit("rankingsUpdated", usersWithRank)

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create user",
    })
  }
})

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    })
  }
})

/**
 * @route   DELETE /api/users/:id
 * @desc    Soft delete user (set inactive)
 * @access  Public
 */
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Get updated rankings and emit to all clients
    const users = await User.find({ isActive: true }).sort({ totalPoints: -1 })
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))

    req.io.emit("rankingsUpdated", usersWithRank)

    res.json({
      success: true,
      message: "User deactivated successfully",
    })
  } catch (error) {
    console.error("Error deactivating user:", error)
    res.status(500).json({
      success: false,
      error: "Failed to deactivate user",
    })
  }
})

module.exports = router
