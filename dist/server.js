"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    });
    // Initialize Socket.IO server
    const io = new socket_io_1.Server(server);
    // Listen for client connections
    io.on("connection", (socket) => {
        console.log("A user connected");
        // Handle incoming chat messages
        socket.on("chat message", (msg) => {
            console.log("Message received: ", msg);
            // Broadcast the message to all connected clients
            io.emit("chat message", msg);
        });
        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
    // Start the HTTP server
    server.listen(port, () => {
        console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
    });
});
