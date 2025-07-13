/**
 * API configuration for different environments
 */
const config = {
  development: {
    API_BASE_URL: "http://localhost:5000/api",
    SOCKET_URL: "http://localhost:5000",
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL
      ? `${process.env.REACT_APP_API_URL}/api`
      : "https://ranking-system-mfv5.onrender.com/api",
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || "https://ranking-system-mfv5.onrender.com",
  },
}

const environment = process.env.NODE_ENV || "development"

export const API_BASE_URL = config[environment].API_BASE_URL
export const SOCKET_URL = config[environment].SOCKET_URL

export default config[environment]
