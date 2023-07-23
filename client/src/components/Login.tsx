import React from "react";
import { Link } from "react-router-dom";

function Login() {
  const handleGoogleLogin = () => {
    // Redirect the user to the Google authentication endpoint
    const currentLocation = window.location.href;
    if (!currentLocation.includes("/auth/google")) {
      window.location.href = "http://localhost:3000/auth/google";
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Remember me
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <button className="btn btn-primary" onClick={handleGoogleLogin}>
        Login with Google
      </button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
