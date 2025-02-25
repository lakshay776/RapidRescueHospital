// server.js (localhost:3000)

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { io: ClientIO } = require('socket.io-client'); // WebSocket client for receiving updates

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

// Connect to sender WebSocket at localhost:5000
const senderSocket = ClientIO("http://localhost:5000");

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Listen for real-time updates from sender
senderSocket.on("emergencyUpdate", (data) => {
  console.log("Received emergency update from sender:", data);

  // Save received data
  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to data file:", err);
      return;
    }
    console.log("Data updated successfully on localhost:3000");

    // Broadcast the received update to dashboard clients
    io.emit("emergencyUpdate", data);
  });
});

// Endpoint to retrieve stored data
app.get('/data', (req, res) => {
  fs.readFile('data.json', (err, fileData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data file');
    }
    res.json(JSON.parse(fileData));
  });
});

// WebSocket connection for dashboard clients
io.on('connection', (socket) => {
  console.log('Dashboard connected:', socket.id);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Receiver is running on http://localhost:${PORT}`);
});
