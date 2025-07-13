"use client"

import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { apiService } from "./services/api"
import useSocket from "./hooks/useSocket"

import Header from "./components/Header"
import TopThree from "./components/TopThree"
import UserSelection from "./components/UserSelection"
import Leaderboard from "./components/Leaderboard"
import AddUserModal from "./components/AddUserModal"
import PointsHistory from "./components/PointsHistory"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorBoundary from "./components/ErrorBoundary"
import ConnectionTest from "./components/ConnectionTest"

import "./App.css"

function App() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [pointsHistory, setPointsHistory] = useState([])
  const [error, setError] = useState(null)

  const socket = useSocket()

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
    fetchPointsHistory()
  }, [])

  // Listen for real-time ranking updates
  useEffect(() => {
    if (socket) {
      socket.on("rankingsUpdated", (updatedUsers) => {
        setUsers(updatedUsers)
      })

      return () => {
        socket.off("rankingsUpdated")
      }
    }
  }, [socket])

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      setError(null)
      const response = await apiService.getUsers()

      if (response.data.success) {
        setUsers(response.data.data)
      } else {
        throw new Error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users. Please refresh the page.")
      toast.error("Failed to fetch users")
    } finally {
      setInitialLoading(false)
    }
  }

  // Fetch points history
  const fetchPointsHistory = async () => {
    try {
      const response = await apiService.getPointsHistory()
      if (response.data.success) {
        setPointsHistory(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    }
  }

  // Handle claiming points for selected user
  const handleClaimPoints = async () => {
    if (!selectedUser) {
      toast.warning("Please select a user first!")
      return
    }

    setLoading(true)
    try {
      const response = await apiService.claimPoints(selectedUser)

      if (response.data.success) {
        const { pointsAwarded, newTotalPoints } = response.data.data
        toast.success(`🎉 ${pointsAwarded} points awarded! Total: ${newTotalPoints}`, {
          autoClose: 3000,
        })

        // Refresh history
        fetchPointsHistory()
      } else {
        throw new Error(response.data.error || "Failed to claim points")
      }
    } catch (error) {
      console.error("Error claiming points:", error)
      toast.error(error.response?.data?.error || "Failed to claim points")
    } finally {
      setLoading(false)
    }
  }

  // Handle adding new user
  const handleAddUser = async (userName) => {
    try {
      const response = await apiService.createUser({ name: userName })

      if (response.data.success) {
        toast.success(`User "${userName}" added successfully!`)
        setShowAddModal(false)
      } else {
        throw new Error(response.data.error || "Failed to add user")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add user"
      toast.error(errorMessage)
      throw error // Re-throw to handle in modal
    }
  }

  // Get top 3 users for display
  const topThreeUsers = users.slice(0, 3)
  const remainingUsers = users.slice(3)

  if (initialLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">
          <div className="error-container">
            <h2>⚠️ Something went wrong</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="container">
          <Header />

          {/* Top 3 Users Display */}
          <TopThree users={topThreeUsers} />

          {/* User Selection and Claim Section */}
          <UserSelection
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            onClaimPoints={handleClaimPoints}
            loading={loading}
            onAddUser={() => setShowAddModal(true)}
            onShowHistory={() => setShowHistory(true)}
          />

          {/* Leaderboard */}
          <Leaderboard users={remainingUsers} startRank={4} />

          {/* Add User Modal */}
          {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onAddUser={handleAddUser} />}

          {/* Points History Modal */}
          {showHistory && <PointsHistory history={pointsHistory} onClose={() => setShowHistory(false)} />}

          {/* Debug Component (development only) */}


          {/* Toast Notifications */}
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
