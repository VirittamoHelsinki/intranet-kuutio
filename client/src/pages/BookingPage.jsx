import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fullName, initTimes } from "../features/functions";
import Calendar from "../components/Calendar";
import "../styles/BookingPage.scss";
import bookingApi from "../api/booking";
import BookingListPage from "../components/BookingListPage";
import { bookingTopics } from "../features/arrays";
import { getEndingTime } from "../components/TimeButtonFunctions";
import TimeButton from "../components/TimeButton";
import RegularBooking from "../components/RegularBooking";
import "../styles/RegularBooking.scss"

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newBooking, setNewBooking] = useState(false);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);
  const [timeButtons, setTimeButtons] = useState(initTimes());
  const [showConfirmWindow, setShowConfirmWindow] = useState(false);
  const [showThanksWindow, setShowThanksWindow] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [regularBooking, setRegularBooking] = useState(false);
  const [regularBookingLength, setRegularBookingLength] = useState(1);
  const [regularBookingTimeformat, setRegularBookingTimeformat] = useState(null);


  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

let endingTime = null;
if (selectedTime.length > 0) {
	endingTime = getEndingTime(selectedTime.sort()[selectedTime.length - 1]);
}

const handleRegularBooking = () => {
	setRegularBooking(!regularBooking);
};

const handleRegularBookingLength = (value) => {
	setRegularBookingLength(value);
};

const handleRegularBookingTimeformat = (timeformat) => {
	setRegularBookingTimeformat(timeformat);
};

  const createBooking = () => {
	const data = {
	  topic,
	  name,
	  selectedDate,
	  selectedTime,
	  endingTime,
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

  const handleBookingsUpdate = (updatedBookings) => {
	setBookings(updatedBookings);
  };

  useEffect(() => {
	setNewBooking(false);
	setTopic("");
	setName("");
	if (selectedDate) {
		setTimeButtons(initTimes());
		setSelectedTime([]);
		setRegularBooking(false);
		setRegularBookingTimeformat(null);
		// fetchBookings();
	}
}, [bookings, selectedDate]);

  return (
	<div className="bookingpage-main">
	  <div className="bookingpage-content">
		<div className="calendar-times-content">
		  <Calendar date={date} setDate={setDate} setSelectedDate={setSelectedDate} />
		  {selectedDate &&
			<TimeButton bookings={bookings} selectedDate={selectedDate}
		  			timeButtons={timeButtons} selectedTime={selectedTime}
					setSelectedTime={setSelectedTime} setNewBooking={setNewBooking} />}
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

					<div className="selected-time-header">
						<label>Olet varaamassa klo</label>
					</div>
					<label>
						{selectedTime.sort()[0] + ' - ' + endingTime }
					</label>
					<div className='regular-booking'>
						<input type="checkbox"
						onClick={() => handleRegularBooking()}
						id='regular-booking-checkbox'/>
						<label
						htmlFor='regular-booking-checkbox'>
							Jatkuva varaus
						</label>
					</div>

					{ regularBooking && (
						<RegularBooking selectedDate={selectedDate}
										selectedTime={selectedTime}
										bookings={bookings}
										onRegularLengthChange={handleRegularBookingLength}
										timeformat={regularBookingTimeformat}
										onTimeformatChange={handleRegularBookingTimeformat}/>
					) }

				</div>

				) : (
					<div className="booking-column">
						<BookingListPage bookings={bookings} onBookingsUpdate={handleBookingsUpdate}/>
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
				<label>
					{ selectedTime[0] + ' - ' + endingTime }
				</label>
			  </div>
			</div>
			{ regularBooking && (
				<div className='detail-row'>
					<div className="detail-subject">
						<label>Jatkuva:</label>
					</div>
					<div className="detail-value">
						<label>
							{regularBookingLength} {regularBookingTimeformat}
						</label>
					</div>
				</div>
			)}
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
			<button className="black-button" onClick={() => {
				setNewBooking(false);
				setShowThanksWindow(false);
			}}>
			  Tee uusi varaus
			</button>
			<Link to="/">
			  <button className="nocolor-button" onClick={() => {
				  setNewBooking(false);
				  setShowThanksWindow(false);
				}}>
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
