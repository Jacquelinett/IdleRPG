import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Game from "./components/Game";
import Landing from "./components/Landing";
import CurrentSocketContext from "./SocketContext";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3000");

  useEffect(() => {
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <CurrentSocketContext.Provider value={{ socket: socket }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </CurrentSocketContext.Provider>
  );
}

export default App;
