"use client"

import React from "react"

/**
 * Error Boundary component to catch JavaScript errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app">
          <div className="container">
            <div className="error-container">
              <h2>🚨 Oops! Something went wrong</h2>
              <p>We're sorry, but something unexpected happened.</p>
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
