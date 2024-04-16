import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    selectedDate: {
      type: Date,
      required: true,
    },
    selectedTime: {
      type: [String],
      required: true,
    },
    endingTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);


