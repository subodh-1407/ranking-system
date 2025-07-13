/**
 * Leaderboard component displays users ranked below top 3
 * @param {Array} users - Array of users to display in leaderboard
 * @param {number} startRank - Starting rank number for the list
 */
const Leaderboard = ({ users, startRank }) => {
  // Helper function to get user initials for avatar
  const getUserInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?"
  }

  // Helper function to get trophy emoji based on rank
  const getTrophyEmoji = (rank) => {
    if (rank <= 10) return "🏆"
    if (rank <= 20) return "🥉"
    return "🏅"
  }

  if (users.length === 0) {
    return (
      <div className="leaderboard">
        <h3 className="leaderboard-title">🏅 Leaderboard</h3>
        <div
          style={{
            textAlign: "center",
            color: "#7f8c8d",
            padding: "20px",
            fontStyle: "italic",
          }}
        >
          No additional users to display
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard">
      <h3 className="leaderboard-title">🏅 Leaderboard</h3>

      {users.map((user, index) => {
        const currentRank = startRank + index
        return (
          <div key={user._id} className="leaderboard-item fade-in">
            <div className="item-rank">{currentRank}</div>
            <div className="item-avatar">{getUserInitials(user.name)}</div>
            <div className="item-info">
              <div className="item-name">{user.name}</div>
              <div className="item-points">{user.totalPoints.toLocaleString()} points</div>
            </div>
            <div className="trophy-icon">{getTrophyEmoji(currentRank)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Leaderboard
