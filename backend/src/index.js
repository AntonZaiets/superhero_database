import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { initGridFS } from './config/gridfs.js';
import superheroRoutes from './routes/superhero.js';
import { asyncHandler } from './middleware/asyncHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();
initGridFS();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/superheroes', superheroRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Superhero API is running' });
});

app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

app.use(asyncHandler);

app.use((err, req, res) => {
  console.error('Error stack:', err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: errors.join(', '),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not valid',
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
