import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2 text-red-800">Something went wrong</h2>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
