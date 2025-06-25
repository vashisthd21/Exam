import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';

import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

//Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

//routes
import authroute from './routes/route.auth.js'
import quizroute from './routes/route.quiz.js'

app.use('/api/auth', authroute);
app.use('/api/quiz',quizroute);

//mongoose connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err=> console.log(err));

//Socket.io
io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    //IF TAB IS SWITCHED
    socket.on('tab-switched', (userId) =>{
        console.log(`User ${userId} switched tabs`);
        io.emit('alter-host',userId);
    });

    socket.on('disconnect', () =>{
        console.log("User disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));