import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roomRouter from './routes/roomRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  next();
});

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/user', userRouter);
app.use('/room', roomRouter);

// Test route
app.get('/', (req, res) => res.json({ message: 'Welcome to our API' }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }));

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);
    console.log('MongoDB connected');
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

startServer();
