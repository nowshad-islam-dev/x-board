import express from 'express';
import http from 'node:http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow request from Frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middlewares
app.use(cors());

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast drawing data to all clients
  socket.on('drawing', (line) => {
    socket.broadcast.emit('drawing', line);
  });

  // Broadcast undo/redo events to all clients
  socket.on('undo', () => {
    socket.broadcast.emit('undo');
  });

  socket.on('redo', () => {
    socket.broadcast.emit('redo');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => res.end('Hello from server'));

const port = 3001;

server.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
