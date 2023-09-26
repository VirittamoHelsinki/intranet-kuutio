// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoDBURL } from './config.js';
import bookingRoute from './routes/bookingRoute.js';

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Welcome to kuutio booking.');
});

// Mount the bookingRoute under the /api/booking path
app.use('/api/booking', bookingRoute);
// // app.use('/api/authorize', authorizeRouter);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });


