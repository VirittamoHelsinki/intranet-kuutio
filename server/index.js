// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoUri } from './config.js';
import bookingRoute from './routes/bookingRoute.js';
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



// Directs requests that dont match any of the routes previously
// defined to the frontend.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/dist/index.html'));
})

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });


//////////////////////////////////////////
// index.js
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import { PORT, mongoUri } from './config.js';
// import bookingRoute from './routes/bookingRoute.js';

// const app = express();

// // Middleware for parsing request body
// app.use(express.json());

// // Middleware for handling CORS POLICY
// app.use(cors());

// app.get('/', (request, response) => {
//   response.status(200).send('Welcome to kuutio booking.');
// });

// app.use('/api/booking', bookingRoute);
// app.use('/api/booking', bookingRoute);
// mongoose
//   .connect(mongoUri)
//   .then(() => {
//     console.log('App connected to database');
//     app.listen(PORT, () => {
//       console.log(`App is listening to port: ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error connecting to database:', error);
//   });






// import express from 'express';
// import { PORT, mongoUri } from './config.js';
// import mongoose from 'mongoose';
// import bookingRoute from './routes/bookingRoute.js';
// //import {authorizeRouter} from './routes/authorizeRouter.js';

// import cors from 'cors';

// const app = express();

// // Middleware for parsing request body
// app.use(express.json());

// // Middleware for handling CORS POLICY
// app.use(cors());

// app.get('/', (request, response) => {
//   console.log(request);
//   return response.status(234).send('Welcome to kuutio booking.');
// });

// app.use('/api/booking', bookingRoute);
// // app.use('/api/authorize', authorizeRouter);

// mongoose
//   .connect(mongoUri)
//   .then(() => {
//     console.log('App connected to database');
//     app.listen(PORT, () => {
//       console.log(`App is listening to port: ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });
