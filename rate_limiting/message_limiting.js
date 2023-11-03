const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running");
});

const wss = new WebSocket.Server({ server });

const MAX_MESSAGES_PER_SECOND = 1; // Define the maximum allowed messages per second per client
const MESSAGE_INTERVAL = 5000 / MAX_MESSAGES_PER_SECOND; // Calculate the message interval in milliseconds

const clients = new Set(); // Keep track of connected clients
const lastMessageTimestamps = new Map(); // Track the last message timestamp for each client

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  ws.on("message", (message) => {
    // console.log(isAllowedToMessage(ws))
    if ((isAllowedToMessage(ws))) {
      // Process the message
      wss.clients.forEach((client) => {
            console.log("Received Message: ", message.toString())
            ws.send("Server has received your Message")
      });
    } else {
      // Rate limit exceeded
      ws.send("Rate limit exceeded. Please slow down.");
      console.log("Message Limit Exceeded!!!")
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    lastMessageTimestamps.delete(ws);
    console.log("Client disconnected");
  });
});

function isAllowedToMessage(client) {
  const lastMessageTime = lastMessageTimestamps.get(client) || 0;
  const currentTime = Date.now();
  console.log(currentTime - lastMessageTime)
  if (currentTime - lastMessageTime >= MESSAGE_INTERVAL) {
    lastMessageTimestamps.set(client, currentTime);
    return true;
  }
  return false;
}

server.listen(8080, () => {
  console.log("WebSocket server is listening on port 8080");
});
