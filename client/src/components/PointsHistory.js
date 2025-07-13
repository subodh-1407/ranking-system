"use client"

/**
 * PointsHistory component displays the history of point claims
 * @param {Array} history - Array of points history records
 * @param {Function} onClose - Function to close the modal
 */
const PointsHistory = ({ history, onClose }) => {
  // Helper function to format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`

    return date.toLocaleDateString()
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
          <h3 className="modal-title">📊 Points History</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#7f8c8d",
                padding: "20px",
                fontStyle: "italic",
              }}
            >
              No points claimed yet
            </div>
          ) : (
            history.map((record) => (
              <div key={record._id} className="history-item">
                <div className="history-info">
                  <div className="history-user">{record.userName}</div>
                  <div className="history-time">{formatTime(record.timestamp)}</div>
                </div>
                <div className="history-points">+{record.pointsAwarded}</div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#7f8c8d",
            marginTop: "15px",
            textAlign: "center",
          }}
        >
          💡 Showing recent point claims
        </div>
      </div>
    </div>
  )
}

export default PointsHistory
