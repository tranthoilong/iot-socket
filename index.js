const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const app = express();




const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

// app.use(express.static(path.join(__dirname, 'public')));

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.get('/chat', (req, res) => {
//     res.json({ message: "Welcome to the chat endpoint!" });
// });

app.get('/products', (req, res) => {
    // Danh sách sản phẩm mẫu
    const products = [
        { id: 1, name: 'Sản phẩm 1', price: 100 },
        { id: 2, name: 'Sản phẩm 2', price: 200 },
        { id: 3, name: 'Sản phẩm 3', price: 300 },
        { id: 4, name: 'Sản phẩm 4', price: 400 },
        { id: 5, name: 'Sản phẩm 5', price: 500 },
        { id: 6, name: 'Sản phẩm 6', price: 600 },
        { id: 7, name: 'Sản phẩm 7', price: 700 },
        { id: 8, name: 'Sản phẩm 8', price: 800 },
        { id: 9, name: 'Sản phẩm 9', price: 900 },
        { id: 10, name: 'Sản phẩm 10', price: 1000 },
        { id: 11, name: 'Sản phẩm 11', price: 1100 },
        { id: 12, name: 'Sản phẩm 12', price: 1200 },
    ];

    res.json({
        status: 200,
        message: 'Thành công',
        data: products
    });
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