const WebSocket = require("ws");
const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Health Check: WebSocket server is running");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    const sendMessageToClient = () => {
    ws.send("Server message sent to the client every 5 seconds");
  };

  // Send a message to the client every 5 seconds
    const interval = setInterval(sendMessageToClient, 5000);

    ws.on("message", (message) => {
        // Broadcast the message to all connected clients

        wss.clients.forEach((client) => {
            console.log("Received Message: ", message.toString())
            ws.send("Server has received your Message")
        });
    });

    ws.on("close", () => {
        clearInterval(interval);
        console.log("Client disconnected");
    });

    ws.on("error", (event)=>{
        console.error("WebSocket error:", event);
    })
    
});

server.listen(8080, () => {
    console.log("WebSocket server is listening on port 8080");
});
