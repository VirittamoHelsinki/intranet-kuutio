import React, { useState, useEffect } from "react";

import bookingApi from "../api/booking";

import "../styles/BookingPage.scss";

const BookingListPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from the backend when the component mounts
    bookingApi
      .getAll()
      .then((response) => {
        setBookings(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  return (
    <div>
      <h2>Booking List</h2>
      <div className="booking-cards">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <div className="card-content">
              <strong>Aihe: </strong> {booking.topic}
              <br />
              <strong>Nimi: </strong> {booking.name}
              <br />
              <strong>Päivämäärä: </strong>{" "}
              {new Date(booking.selectedDate).toLocaleDateString()}
              <br />
              <strong>Aika: </strong> {booking.selectedTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPage;
