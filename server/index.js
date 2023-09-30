import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoUri } from './config.js';
import bookingRoute from './routes/bookingRoute.js';
import authorizeRouter from './routes/authorizeRouter.js';
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for serving static frontend files
app.use(express.static('dist'))

// Middleware for handling CORS POLICY
app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Welcome to kuutio booking.');
});

// Mount the bookingRoute under the /api/booking path
app.use('/api/booking', bookingRoute);
app.use('/api/authorize', authorizeRouter);

// Directs requests that dont match any of the routes previously
// defined to the frontend.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/dist/index.html'));
})

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Kuutio app connected to database');
    app.listen(PORT, () => {
      console.log(`Kuutio app is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });



