"use client"

import { useEffect, useRef } from "react"
import io from "socket.io-client"
import { SOCKET_URL } from "../config/api"

/**
 * Custom hook for Socket.io connection
 */
export const useSocket = () => {
  const socketRef = useRef(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 20000,
    })

    const socket = socketRef.current

    socket.on("connect", () => {
      console.log("✅ Connected to server")
    })

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server")
    })

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
    })

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return socketRef.current
}

export default useSocket
