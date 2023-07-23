import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <Link to="/login">
        <button className="btn btn-primary">Play</button>
      </Link>
    </div>
  );
}

export default Landing;
