"use client"

/**
 * UserSelection component handles user selection and point claiming
 * @param {Array} users - List of all users
 * @param {string} selectedUser - Currently selected user ID
 * @param {Function} setSelectedUser - Function to update selected user
 * @param {Function} onClaimPoints - Function to handle point claiming
 * @param {boolean} loading - Loading state for claim button
 * @param {Function} onAddUser - Function to open add user modal
 * @param {Function} onShowHistory - Function to show points history
 */
const UserSelection = ({ users, selectedUser, setSelectedUser, onClaimPoints, loading, onAddUser, onShowHistory }) => {
  return (
    <div className="user-selection">
      <div className="selection-header">
        <h2 className="selection-title">Select User & Claim Points</h2>
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onAddUser}>
            + Add User
          </button>
          <button className="btn-secondary" onClick={onShowHistory}>
            📊 History
          </button>
        </div>
      </div>

      <div className="selection-controls">
        <select className="user-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Choose a user...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.totalPoints} points)
            </option>
          ))}
        </select>

        <button className="claim-btn" onClick={onClaimPoints} disabled={!selectedUser || loading}>
          {loading ? <span className="loading"></span> : "🎯 Claim"}
        </button>
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#7f8c8d",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        💡 Claim random points (1-10) for the selected user
      </div>
    </div>
  )
}

export default UserSelection
