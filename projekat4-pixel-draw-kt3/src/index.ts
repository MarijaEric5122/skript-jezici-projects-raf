import "reflect-metadata";
import express from "express";
import path from "path";
import http from "http"; 
import { Server } from "socket.io"; 

import { PORT, PORT2, BASE_API_URL } from "./config";
import AppDataSource from "./data-source";
import authRouter from "./routes/auth";
import picturesRouter from "./routes/pictures";

const app = express();
app.use(express.json());

// API routes
app.use(`${BASE_API_URL}/auth`, authRouter);
app.use(`${BASE_API_URL}/pictures`, picturesRouter);

// Serve static files
app.use(express.static(path.join(__dirname, "../html")));

// Serve HTML file for root route
app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "../html", "index.html"));
});

// Start the main server (API server)
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

// Create a separate server for WebSocket communication
//const PORT2 = 5000; // Define a new port for the WebSocket server
const socketServer = http.createServer();
const io = new Server(socketServer, {
  cors: {
    origin: "", // Add the appropriate origin for CORS
  },
});

// WebSocket event handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinPictureRoom", (pictureId) => {
    socket.join(pictureId);
    console.log(`Socket ${socket.id} joined room for picture ${pictureId}`);
  });

  socket.on("cellUpdate", (payload) => {
    const { pictureId } = payload;
    socket.to(pictureId).emit("cellUpdate", payload);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the WebSocket server
socketServer.listen(PORT2, () => {
  console.log(`WebSocket server listening on port ${PORT2}`);
});
