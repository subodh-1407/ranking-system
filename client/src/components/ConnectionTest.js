"use client"

import { useState, useEffect } from "react"
import { apiService } from "../services/api"
import { API_BASE_URL, SOCKET_URL } from "../config/api"

/**
 * Connection Test component for debugging API connectivity
 */
const ConnectionTest = () => {
  const [apiStatus, setApiStatus] = useState("checking")
  const [socketStatus, setSocketStatus] = useState("checking")

  useEffect(() => {
    testApiConnection()
  }, [])

  const testApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace("/api", "")}/`)
      if (response.ok) {
        setApiStatus("connected")
      } else {
        setApiStatus("error")
      }
    } catch (error) {
      console.error("API connection test failed:", error)
      setApiStatus("error")
    }
  }

  const testHealthEndpoint = async () => {
    try {
      const response = await apiService.healthCheck()
      console.log("Health check response:", response.data)
      alert("Health check successful!")
    } catch (error) {
      console.error("Health check failed:", error)
      alert("Health check failed: " + error.message)
    }
  }

  if (process.env.NODE_ENV === "production") {
    return null // Don't show in production
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        fontSize: "12px",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <strong>Debug Info:</strong>
      </div>
      <div>API URL: {API_BASE_URL}</div>
      <div>Socket URL: {SOCKET_URL}</div>
      <div>
        API Status: <span style={{ color: apiStatus === "connected" ? "green" : "red" }}>{apiStatus}</span>
      </div>
      <button
        onClick={testHealthEndpoint}
        style={{
          marginTop: "5px",
          padding: "4px 8px",
          fontSize: "10px",
          cursor: "pointer",
        }}
      >
        Test Health
      </button>
    </div>
  )
}

export default ConnectionTest
