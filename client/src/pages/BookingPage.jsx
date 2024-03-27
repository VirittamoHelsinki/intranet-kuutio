import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fullName, initTimes } from "../features/functions";
import Calendar from "../components/Calendar";
import "../styles/BookingPage.scss";
import bookingApi from "../api/booking";
import BookingListPage from "./BookingListPage";
import { bookingTopics } from "../features/arrays";

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newBooking, setNewBooking] = useState(false);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookings, setBookings] = useState(initTimes());
  const [showConfirmWindow, setShowConfirmWindow] = useState(false);
  const [showThanksWindow, setShowThanksWindow] = useState(false);
  const [selectedButton, setSelectedButton] = useState(false);

  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

  const createBooking = () => {
	const data = {
	  topic,
	  name,
	  selectedDate,
	  selectedTime,
	};
	bookingApi
	  .create(data)
	  .then(() => {
		setLoading(false);
		enqueueSnackbar('Booking Created successfully', { variant: 'success' });
		navigate('/');
	  })
	  .catch((error) => {
		setLoading(false);
		// alert('An error happened. Please Chack console');
		enqueueSnackbar('Error', { variant: 'error' });
		console.log(error);
	  });
	// Create booking logic (removed for simplicity)
  };

  const fetchBookings = () => {
	// Fetch bookings logic (removed for simplicity)
  };

  const handleButtonClick = (booking) => {
	setSelectedButton(booking.time);
	setSelectedTime(booking.time);
	setNewBooking(true);
  };

  const handleButtonUnClick = () => {
	setSelectedButton(false);
	setSelectedTime(null);
	setNewBooking(false);
  };

  useEffect(() => {
	setBookings(initTimes());
	setNewBooking(false);
	setTopic("");
	setName("");
	if (selectedDate) {
	  fetchBookings();
	}
  }, [selectedDate]);

  return (
	<div className="bookingpage-main">
	  <div className="bookingpage-content">
		<div className="calendar-times-content">
		  <Calendar date={date} setDate={setDate} setSelectedDate={setSelectedDate} />
		  {selectedDate && (
			<div className="times-content">
			  <div className="times-headline">
				<label>Ajat</label>
			  </div>

			<div className="times-row">
				{bookings.map((booking, index) => {
					const disabled = booking.data === null ? false : true;
					const isClicked = selectedButton === booking.time;
					return (
						<div
						className={`time-box ${disabled ? " disabled" : ""}
						${(isClicked && !disabled) ? "selected" : ""}`}
						key={index}
						onClick={() => {
							if (!disabled) {
								if (selectedTime != booking.time) {
									handleButtonClick(booking);
								}
								else {
									handleButtonUnClick();
								}
							}}}>
							{booking.time}
						</div>
					);
				})}

			</div>

			</div>
		  )}
		</div>
		<div className="booking-content">
		  <div className="booking-data-content">
			{selectedDate && (
				<div className="booking-data">
					<div className="booking-headline">
					<label>{date.toLocaleDateString("fi-FI", options)}</label>
					</div>
					{newBooking ? (
					<div className="new-booking-content">

						<div className="topic-content">
							<input placeholder="Nimi" value={name} onChange={(e) => setName(e.target.value)} />
						</div>

						<div className="topic-content">
							<select value={topic} onChange={(e) => setTopic(e.target.value)}>
								<option value="">Valitse aihe</option>
								{bookingTopics.map((topic, index) => (
									<option key={index} value={topic}>{topic}</option>
								))}
							</select>
						</div>

					<div className="selected-time">
						<label>Olet varaamassa klo</label>
						<label>{selectedTime}</label>
					</div>
				</div>
				) : (
					<div className="booking-column">
						<BookingListPage />
					</div>
				)}
			  </div>
			)}
		  </div>
		  <div className="booking-button-content">
			{topic && name !== "" ? (
			  <button className="booking-button" onClick={() => setShowConfirmWindow(true)}>
				Varaa
			  </button>
			) : (
			  <button className="booking-button disabled">Varaa</button>
			)}
			<Link to="/" className="homepage-button">
			  Palaa etusivulle
			</Link>

		  </div>
		</div>
	  </div>
	  {showConfirmWindow && (
		<div className="fullscreen-modal">
		  <div className="modal-detail-content">
			<div className="detail-row">
			  <div className="detail-subject">
				<label>Aihe:</label>
			  </div>
			  <div className="detail-value">
				<label>{topic}</label>
			  </div>
			  </div>
			  <div className="detail-row">
			  <div className="detail-subject">
				<label>Nimi:</label>
			  </div>
			  <div className="detail-value">
				<label>{name}</label>
			  </div>
			</div>
			<div className="detail-row">
			  <div className="detail-subject">
				<label>Päivä:</label>
			  </div>
			  <div className="detail-value">
				<label>{selectedDate.toLocaleDateString("fi-FI")}</label>
			  </div>
			</div>
			<div className="detail-row">
			  <div className="detail-subject">
				<label>Aika:</label>
			  </div>
			  <div className="detail-value">
				<label>{selectedTime}</label>
			  </div>
			</div>
		  </div>
		  <div className="modal-buttons">
			<button
			  className="black-button"
			  onClick={() => {
				createBooking();
				setShowConfirmWindow(false);
				setShowThanksWindow(true);
			  }}
			>
			  Vahvista
			</button>
			<button className="nocolor-button" onClick={() => setShowConfirmWindow(false)}>
			  Peruuta
			</button>
		  </div>
		</div>
	  )}
	  {showThanksWindow && (
		<div className="fullscreen-modal">
		  <div className="modal-thanks-content">
			<div className="thanks-label">
			  <label>Kiitos!</label>
			</div>
			<div className="description-label">
			  <label>Huone on varattu sinulle!</label>
			</div>
		  </div>
		  <div className="modal-buttons">
			<button className="black-button" onClick={() => setShowThanksWindow(false)}>
			  Tee uusi varaus
			</button>
			<Link to="/">
			  <button className="nocolor-button" onClick={() => setShowThanksWindow(false)}>
				Takaisin etusivulle
			  </button>
			</Link>

		  </div>
		</div>
	  )}
	</div>
  );
};

export default BookingPage;
