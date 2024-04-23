import React, { useState, useEffect } from "react";
import bookingApi from "../api/booking";
import "../styles/BookingPage.scss";

const BookingListPage = ({ bookings, onBookingsUpdate }) => {

	const sortBookings = (filteredBookings) => {
		const sortedBookings = filteredBookings.sort((a, b) => {
			const dateComparison = new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime();
			if (dateComparison !== 0) {
				return dateComparison;
			}
			else {
				const timeA = a.selectedTime[0];
				const timeB = b.selectedTime[0];
				return timeA.localeCompare(timeB);
			}
		});
		return sortedBookings;
	};

  useEffect(() => {
    // Fetch bookings from the backend when the component mounts
    bookingApi
      .getAll()
      .then((response) => {
        // Filter out bookings that are older than the current date
        const currentDate = new Date();

        const filteredBookings = response.data.data.filter((booking) => {
          const bookingDate = new Date(booking.selectedDate);

		  // +1 error somewhere in dates, didnt show currentday bookings without this
		  bookingDate.setDate(bookingDate.getDate() + 1);

          return bookingDate >= currentDate;
        });

        onBookingsUpdate(sortBookings(filteredBookings));
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  const handleRemoveBooking = (id) => {
    // Send a request to your API to remove the booking with the given ID
    bookingApi
      .remove(id)
      .then(() => {
        // Update the state to reflect the removed booking
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
              <strong>Aika: </strong> {booking.selectedTime[0]} - { booking.endingTime }
            </div>
            <button onClick={() => handleRemoveBooking(booking._id)}>
              Poista varaus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPage;
