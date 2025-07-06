import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import cookieParser from 'cookie-parser';

// server.js or app.js
const contactRoute = require('./routes/contact');

import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

const app = express();
const server = http.createServer(app);
app.use(cookieParser());
const io = new Server(server, {
  cors: {
    origin: 'https://exam-secure.vercel.app', 
    methods: ['GET', 'POST'],
  },
});

//Middleware
app.use(cors({
  // origin: 'http://localhost:5173', 
  origin: 'https://exam-secure.vercel.app',
  credentials: true
}));

app.use(express.json());

//routes
import authroute from './routes/route.auth.js'
import quizroute from './routes/route.quiz.js'

app.use('/api/auth', authroute);
app.use('/api/quiz',quizroute);
app.use('/api/contact', contactRoute);

//Db connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err=> console.log(err));

//Socket.io
io.on('connection', (socket) => {
    console.log('User connected', socket.id);
    socket.on('disconnect', () =>{
        console.log("User disconnected", socket.id);
        alert("User disconnected");
        window.location.href = '/login';
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));