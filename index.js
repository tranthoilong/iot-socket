const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const app = express();




const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/chat', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/chat', (req, res) => {
    res.json({ message: "Welcome to the chat endpoint!" });
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});

let lastMessage = null;

wss.on('connection', (ws) => {
    console.log('Client connected');

    if (lastMessage) {
        ws.send(lastMessage);
    }

    ws.on('message', (message) => {
        lastMessage = message;
        console.log(`Received: ${message}`);
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                console.log(`Received: ${message}`);
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
