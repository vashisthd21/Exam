const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://exam-weld-mu.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
