/**
 * TopThree component displays the top 3 users in a podium-style layout
 * @param {Array} users - Array of top 3 users with ranking data
 */
const TopThree = ({ users }) => {
  // Helper function to get rank badge class
  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1:
        return "gold"
      case 2:
        return "silver"
      case 3:
        return "bronze"
      default:
        return "gold"
    }
  }

  // Helper function to get user initials for avatar
  const getUserInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?"
  }

  // Helper function to get podium item class for ordering
  const getPodiumClass = (rank) => {
    switch (rank) {
      case 1:
        return "podium-item first"
      case 2:
        return "podium-item second"
      case 3:
        return "podium-item third"
      default:
        return "podium-item"
    }
  }

  return (
    <div className="top-three">
      <div className="podium">
        {users.map((user) => (
          <div key={user._id} className={getPodiumClass(user.rank)}>
            <div className={`rank-badge ${getRankBadgeClass(user.rank)}`}>{user.rank}</div>
            <div className="user-avatar">{getUserInitials(user.name)}</div>
            <div className="user-name">{user.name}</div>
            <div className="user-points">🏆 {user.totalPoints.toLocaleString()}</div>
          </div>
        ))}

        {/* Fill empty slots if less than 3 users */}
        {users.length < 3 &&
          Array.from({ length: 3 - users.length }, (_, index) => (
            <div key={`empty-${index}`} className={getPodiumClass(users.length + index + 1)}>
              <div className={`rank-badge ${getRankBadgeClass(users.length + index + 1)}`}>
                {users.length + index + 1}
              </div>
              <div className="user-avatar">?</div>
              <div className="user-name">Empty Slot</div>
              <div className="user-points">🏆 0</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TopThree
