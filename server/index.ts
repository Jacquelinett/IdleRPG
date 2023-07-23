import { Server } from "socket.io";
import { Pool } from "pg";

import express from "express";
import cors from "cors";
import { createServer } from "http";
import bodyParser from "body-parser";
import passport from "passport";
import passportGoogleOAuth2 from "passport-google-oauth20";
import cookieSession from "cookie-session";

import secret from "./secret.json";

const app = express();
const server = createServer(app);

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  },
});

// Create a new pool object with your PostgreSQL connection details
const pool = new Pool({
  user: secret.database.user,
  host: secret.database.host,
  database: secret.database.database,
  password: secret.database.password,
  port: 5432, // or the port number used by your PostgreSQL server
});

// Test the connection
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to PostgreSQL database!");
    // Perform database operations here
    done(); // Release the client back to the pool
  }
});

// Passport configuration
passport.use(
  new passportGoogleOAuth2.Strategy(
    {
      clientID: secret.web.client_id,
      clientSecret: secret.web.client_secret,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // This is where you would typically save the user profile to your database
      done(null, profile);
    }
  )
);

// Sessions configuration
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3001/game");
  }
);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected!");

  socket.on("disconnect", () => {
    console.log("A user disconnected!");
  });
});
