import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO server
  const io = new Server(server);

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
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
  });
});
