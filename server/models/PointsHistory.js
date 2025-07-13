const mongoose = require("mongoose")

/**
 * Points History Schema for tracking all point claims
 */
const pointsHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    pointsAwarded: {
      type: Number,
      required: [true, "Points awarded is required"],
      min: [1, "Points must be at least 1"],
      max: [10, "Points cannot exceed 10"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
pointsHistorySchema.index({ timestamp: -1 })
pointsHistorySchema.index({ userId: 1 })

module.exports = mongoose.model("PointsHistory", pointsHistorySchema)
