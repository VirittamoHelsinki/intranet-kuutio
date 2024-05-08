import React, { useState, useEffect } from "react";
import bookingApi from "../api/booking";
import "../styles/BookingPage.scss";
import Alert from './Alert';

export const sortBookings = (filteredBookings) => {
  const sortedBookings = filteredBookings.sort((a, b) => {
    const dateComparison = new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    } else {
      const timeA = a.selectedTime[0];
      const timeB = b.selectedTime[0];
      return timeA.localeCompare(timeB);
    }
  });
  return sortedBookings;
};

const BookingListPage = ({ onBookingsUpdate , selectedDate, selectedBookings}) => {
  
  useEffect(() => {
    bookingApi
      .getAll()
      .then((response) => {
        const currentDate = new Date();
        const filteredBookings = response.data.data.filter((booking) => {
          const bookingDate = new Date(booking.selectedDate);
          bookingDate.setDate(bookingDate.getDate() + 1);
          return bookingDate >= currentDate;
        });
        onBookingsUpdate(sortBookings(filteredBookings));
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, [selectedDate]);


  const handleRemoveBooking = (id) => {
    bookingApi
      .remove(id)
      .then(() => {
        onBookingsUpdate((prevBookings) => prevBookings.filter((booking) => booking._id !== id));
      })
      .catch((error) => {
        console.error("Error removing booking:", error);
      });
  };

  return (
    <div>
      <h2>Varauslista</h2>
      <div className="booking-cards">
        {selectedBookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <div className="card-content">
              <strong>Aihe: </strong> {booking.topic}
              <br />
              <strong>Nimi: </strong> {booking.name}
              <br />
              <strong>Päivämäärä: </strong>{" "}
              {new Date(booking.selectedDate).toLocaleDateString()}
              <br />
              <strong>Aika: </strong> {booking.selectedTime[0]} - { booking.endingTime }
            </div>
            {/* Replace the button with the Alert component */}
            <Alert onRemoveBooking={() => handleRemoveBooking(booking._id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPage;