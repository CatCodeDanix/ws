const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const clients = new Set();

app.use(cors());
app.use(express.json());

// Start WebSocket server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Extension connected");
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Extension disconnected");
  });
});

// Handle POST requests
app.post("/update", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

  res.status(200).send("Data sent to extension");
});
