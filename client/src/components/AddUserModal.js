"use client"

import { useState } from "react"

/**
 * AddUserModal component for adding new users to the system
 * @param {Function} onClose - Function to close the modal
 * @param {Function} onAddUser - Function to handle user addition
 */
const AddUserModal = ({ onClose, onAddUser }) => {
  const [userName, setUserName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!userName.trim()) {
      setError("Please enter a valid name")
      return
    }

    // Check name length
    if (userName.trim().length < 2) {
      setError("Name must be at least 2 characters long")
      return
    }

    if (userName.trim().length > 50) {
      setError("Name must be less than 50 characters")
      return
    }

    setIsSubmitting(true)
    try {
      await onAddUser(userName.trim())
      setUserName("")
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add user")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle modal backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">➕ Add New User</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="userName">
              User Name
            </label>
            <input
              id="userName"
              type="text"
              className="form-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user name..."
              maxLength={50}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting || !userName.trim()}>
            {isSubmitting ? (
              <>
                <span className="loading"></span>
                Adding...
              </>
            ) : (
              "Add User"
            )}
          </button>
        </form>

        <div
          style={{
            fontSize: "12px",
            color: "#7f8c8d",
            marginTop: "10px",
            textAlign: "center",
          }}
        >
          💡 User will start with 0 points
        </div>
      </div>
    </div>
  )
}

export default AddUserModal
