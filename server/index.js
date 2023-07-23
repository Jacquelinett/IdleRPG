"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const secret_json_1 = __importDefault(require("./secret.json"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        // allowedHeaders: ["my-custom-header"],
        // credentials: true
    },
});
// Create a new pool object with your PostgreSQL connection details
const pool = new pg_1.Pool({
    user: secret_json_1.default.database.user,
    host: secret_json_1.default.database.host,
    database: secret_json_1.default.database.database,
    password: secret_json_1.default.database.password,
    port: 5432, // or the port number used by your PostgreSQL server
});
// Test the connection
pool.connect((err, client, done) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    }
    else {
        console.log("Connected to PostgreSQL database!");
        // Perform database operations here
        done(); // Release the client back to the pool
    }
});
// Passport configuration
passport_1.default.use(new passport_google_oauth20_1.default.Strategy({
    clientID: secret_json_1.default.web.client_id,
    clientSecret: secret_json_1.default.web.client_secret,
    callbackURL: "http://localhost:3001/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    // This is where you would typically save the user profile to your database
    done(null, profile);
}));
// Sessions configuration
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(cors_1.default);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3001/game");
});
// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected!");
    socket.on("disconnect", () => {
        console.log("A user disconnected!");
    });
});
