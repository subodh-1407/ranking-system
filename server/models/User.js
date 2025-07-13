const mongoose = require("mongoose")

/**
 * User Schema for storing user information and points
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: [0, "Points cannot be negative"],
    },
    avatar: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
userSchema.index({ totalPoints: -1 })
userSchema.index({ name: 1 })

// Virtual for user initials
userSchema.virtual("initials").get(function () {
  return this.name ? this.name.charAt(0).toUpperCase() : "?"
})

// Method to increment points
userSchema.methods.addPoints = function (points) {
  this.totalPoints += points
  return this.save()
}

module.exports = mongoose.model("User", userSchema)
