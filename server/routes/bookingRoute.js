
import express from 'express';
import { Booking } from '../models/bookingModel.js';

const router = express.Router();

// Route for posting a new Booking
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.topic ||
      !request.body.name ||
      !request.body.selectedDate ||
      !request.body.selectedTime
    ) {
      return response.status(400).send({
        message: 'Send all required fields: topic, name, date, time',
      });
    }
    const newBooking = {
      topic: request.body.topic,
      name: request.body.name,
      selectedDate: request.body.selectedDate,
      selectedTime: request.body.selectedTime,
    };

    const booking = await Booking.create(newBooking);

    return response.status(201).send(booking);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Bookings from the database
router.get('/getbookings', async (request, response) => {
  try {
    const bookings = await Booking.find({});

    return response.status(200).json({
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;




////////////////////////////////////////////////
// // bookingRoute.js
// import express from 'express';
// import { Booking } from '../models/bookingModel.js';

// const router = express.Router();

// // Route for posting a new Booking
// router.post('/', async (request, response) => {
//   try {
//     if (
//       !request.body.topic ||
//       !request.body.name ||
//       !request.body.date ||
//       !request.body.time
//     ) {
//       return response.status(400).send({
//         message: 'Send all required fields: topic, name, date, time',
//       });
//     }
//     const newBooking = {
//       topic: request.body.topic,
//       name: request.body.name,
//       date: request.body.date,
//       time: request.body.time,
//     };

//     const booking = await Booking.create(newBooking);

//     return response.status(201).send(booking);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// // Route for Get All Books from database
// router.get('/api/getbookings', async (request, response) => {
//   try {
//     const bookings = await Booking.find({});

//     return response.status(200).json({
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// export default router;

///////////////////////////////////////////////////////

// import express from 'express';
// import { Booking } from '../models/bookingModel.js';

// const router = express.Router();

// // Route for posting a new Booking
// router.post('/api/booking', async (request, response) => {
//   try {
//     if (
//       !request.body.topic ||
//       !request.body.name ||
//       !request.body.date ||
//       !request.body.time
//     ) {
//       return response.status(400).send({
//         message: 'Send all required fields: topic, name, date, time'
//       });
//     }
//     const newBooking = {
//       topic: request.body.topic,
//       name: request.body.name,
//       date: request.body.date,
//       time: request.body.time,
//     };

//     const booking = await Booking.create(newBooking);

//     return response.status(201).send(booking);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// export default router;

// // Route for Get All Books from database
// router.get('/', async (request, response) => {
//   try {
//     const bookings = await Booking.find({});

//     return response.status(200).json({
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// // Route for Delete a booking
// router.delete('/:id', async (request, response) => {
//   try {
//     const { id } = request.params;

//     const result = await Booking.findByIdAndDelete(id);

//     if (!result) {
//       return response.status(404).json({ message: 'Booking not found' });
//     }

//     return response.status(200).send({ message: 'Booking deleted successfully' });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });



// // Route for Get One Book from database by id
// router.get('/:id', async (request, response) => {
//   try {
//     const { id } = request.params;

//     const book = await Book.findById(id);

//     return response.status(200).json(book);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// // Route for Update a Book
// router.put('/:id', async (request, response) => {
//   try {
//     if (
//       !request.body.topic ||
//       !request.body.name ||
//       !request.body.date
//     ) {
//       return response.status(400).send({
//         message: 'Send all required fields: topic, name, date',
//       });
//     }

//     const { id } = request.params;

//     const result = await Book.findByIdAndUpdate(id, request.body);

//     if (!result) {
//       return response.status(404).json({ message: 'Book not found' });
//     }

//     return response.status(200).send({ message: 'Book updated successfully' });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });




