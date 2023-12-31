import express from 'express';
import { Booking } from '../models/bookingModel.js';
import { requireAuthorization } from '../middleware/authorize.js';

const router = express.Router();

// From here on, require authorization level 1 on all routes.
//router.all('*', requireAuthorization(1))

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

router.delete('/:id', async (request, response) => {
  try {
    const booking = await Booking.findById(request.params.id);

    // Might want to check if the user is the owner of the booking
    // first. Now allowing anyone with  access level 1 to delete any booking.

    if (booking) {
      await Booking.findByIdAndRemove(request.params.id);
      
      response.status(200).send({ message: 'Booking removed' });
    } else {
      response.status(404).send({ message: 'Booking not found' });
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;