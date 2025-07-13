const express = require("express")
const router = express.Router()
const User = require("../models/User")
const PointsHistory = require("../models/PointsHistory")

/**
 * @route   POST /api/points/claim
 * @desc    Claim random points for a user
 * @access  Public
 */
router.post("/claim", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      })
    }

    // Generate random points between 1 and 10
    const pointsAwarded = Math.floor(Math.random() * 10) + 1

    // Update user's total points
    const user = await User.findByIdAndUpdate(userId, { $inc: { totalPoints: pointsAwarded } }, { new: true })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Create points history record
    const historyRecord = new PointsHistory({
      userId: user._id,
      userName: user.name,
      pointsAwarded,
      ipAddress: req.ip || req.connection.remoteAddress,
    })
    await historyRecord.save()

    // Get updated rankings
    const users = await User.find({ isActive: true }).sort({ totalPoints: -1 })
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))

    // Emit updated rankings to all clients
    req.io.emit("rankingsUpdated", usersWithRank)

    res.json({
      success: true,
      data: {
        user,
        pointsAwarded,
        newTotalPoints: user.totalPoints,
      },
      message: `${pointsAwarded} points awarded to ${user.name}!`,
    })
  } catch (error) {
    console.error("Error claiming points:", error)
    res.status(500).json({
      success: false,
      error: "Failed to claim points",
    })
  }
})

/**
 * @route   GET /api/points/history
 * @desc    Get points history with pagination
 * @access  Public
 */
router.get("/history", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const history = await PointsHistory.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name")

    const total = await PointsHistory.countDocuments()

    res.json({
      success: true,
      data: history,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching points history:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch points history",
    })
  }
})

/**
 * @route   GET /api/points/stats
 * @desc    Get points statistics
 * @access  Public
 */
router.get("/stats", async (req, res) => {
  try {
    const totalPoints = await PointsHistory.aggregate([
      {
        $group: {
          _id: null,
          totalPointsAwarded: { $sum: "$pointsAwarded" },
          totalClaims: { $sum: 1 },
          averagePoints: { $avg: "$pointsAwarded" },
        },
      },
    ])

    const topClaimers = await PointsHistory.aggregate([
      {
        $group: {
          _id: "$userId",
          userName: { $first: "$userName" },
          totalClaims: { $sum: 1 },
          totalPointsEarned: { $sum: "$pointsAwarded" },
        },
      },
      { $sort: { totalPointsEarned: -1 } },
      { $limit: 5 },
    ])

    res.json({
      success: true,
      data: {
        overall: totalPoints[0] || {
          totalPointsAwarded: 0,
          totalClaims: 0,
          averagePoints: 0,
        },
        topClaimers,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    })
  }
})

module.exports = router
