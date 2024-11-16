const express = require('express');
const cors = require('cors');
const { createServer } = require('http'); // Import createServer
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const httpServer = createServer(app); // Create an HTTP server

const io = new Server(httpServer, { // Pass the HTTP server to socket.io
    cors: {
        origin: 'http://localhost:5174', // Replace with your frontend URL
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('Client_send_msg', (data) => {
        console.log('Message received on server:', data);
        socket.broadcast.emit('Server_msg',data.message)
    });
   
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

});

httpServer.listen(3010, () => console.log('Server running on port 3010'));
