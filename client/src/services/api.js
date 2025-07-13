import axios from "axios"
import { API_BASE_URL } from "../config/api"

/**
 * Axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken")
      // Don't redirect in development
      if (process.env.NODE_ENV === "production") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

/**
 * API service methods
 */
export const apiService = {
  // Users
  getUsers: () => api.get("/users"),
  createUser: (userData) => api.post("/users", userData),
  getUserById: (id) => api.get(`/users/${id}`),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Points
  claimPoints: (userId) => api.post("/points/claim", { userId }),
  getPointsHistory: (page = 1, limit = 50) => api.get(`/points/history?page=${page}&limit=${limit}`),
  getPointsStats: () => api.get("/points/stats"),

  // Health check
  healthCheck: () => api.get("/health"),
}

export default api
