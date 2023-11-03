const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running");
});

const MAX_CONNECTIONS = 3; // Define the maximum allowed concurrent connections

const wss = new WebSocket.Server({ server });

const connectedClients = new Set();

wss.on("connection", (ws) => {
  if (connectedClients.size >= MAX_CONNECTIONS) {
    // Implement connection limiting by rejecting new connections
    ws.send("Connection limit exceeded. Closing the connection.");
    ws.close(1000, "Connection limit exceeded.");
    console.log("Connection limit exceeded.");
    return;
  }

  console.log("Client connected");
  connectedClients.add(ws);

  ws.on("close", () => {
    connectedClients.delete(ws);
    console.log("Client disconnected");
  });
});

server.listen(8080, () => {
  console.log("WebSocket server is listening on port 8080");
});
