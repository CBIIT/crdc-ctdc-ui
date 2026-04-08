import React from "react";
import { Link } from "react-router-dom";

// Error container styles
const ERROR_CONTAINER_STYLES = {
  padding: "40px",
  margin: "20px auto",
  maxWidth: "1000px",
  textAlign: "center",
  fontFamily: "Nunito",
  fontSize: "16px",
  color: "#000",
};

/**
 * Error Message Component
 * Displays error or no data messages
 *
 * @param {Object} props - Component props
 * @param {Error|string|null} props.error - Error object or message to display
 */
const ErrorMessage = ({ error }) => (
  <div style={ERROR_CONTAINER_STYLES}>
    <h2 style={{ color: "#d32f2f", marginBottom: "16px" }}>
      {error ? "Unable to Load Study Details" : "Study Not Found"}
    </h2>
    <p>
      {error ? (
        <>
          We encountered an error while loading the study information. Please
          try refreshing the page or contact support if the problem persists.
          <br />
          <span
            style={{
              fontSize: "14px",
              color: "#666",
              marginTop: "12px",
              display: "block",
            }}
          >
            Error details: {error.message || error.toString()}
          </span>
        </>
      ) : (
        <>
          The requested study could not be found. Please visit the{" "}
          <Link
            to="/studies"
            style={{ color: "#00579E", textDecoration: "underline" }}
          >
            Studies page
          </Link>{" "}
          to browse available studies.
        </>
      )}
    </p>
  </div>
);

export default ErrorMessage;
