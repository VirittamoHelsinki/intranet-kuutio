import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fullName, initTimes } from "../features/functions";
import Calendar from "../components/Calendar";
import "../styles/BookingPage.scss";
import bookingApi from "../api/booking";
import BookingListPage from "../components/BookingListPage";
import { bookingTopics } from "../features/arrays";
import { getEndingTime, disableBookedTimes } from "../components/TimeButtonFunctions";
import TimeButton from "../components/TimeButton";
import RegularBooking from "../components/RegularBooking";
import "../styles/RegularBooking.scss"
import { sortBookings } from "../components/BookingListPage";
import { isSameDate } from "../components/RegularBooking";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(
	new Date().getFullYear(),
	new Date().getMonth(),
	new Date().getDate(),
  ));
  const [newBooking, setNewBooking] = useState(false);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);
  const [timeButtons, setTimeButtons] = useState(initTimes());
  const [showConfirmWindow, setShowConfirmWindow] = useState(false);
  const [showThanksWindow, setShowThanksWindow] = useState(false);
  const [showErrorWindow, setShowErrorWindow] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [regularBooking, setRegularBooking] = useState(false);
  const [regularBookingLength, setRegularBookingLength] = useState(1);
  const [regularBookingTimeformat, setRegularBookingTimeformat] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

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

const getNextValidDay = (oldDate) => {
	let newDate = new Date(oldDate);
	const format = regularBookingTimeformat;

	if (format == 'arkipäivää' || format == 'arkipäivä') {
		newDate.setDate(newDate.getDate() + 1);

		// [sun, mon, tue, wed, thu, fri, sat]
		const weekday = newDate.getDay();
		const skipWeekend = (weekday === 0 || weekday === 6)
			? (weekday === 6 ? 2 : 1)
			: 0

		newDate.setDate(newDate.getDate() + skipWeekend);
	}
	else if (format == 'viikkoa' || format == 'viikko') {
		newDate.setDate(oldDate.getDate() + 7);
	}
	return newDate;
};

const newBookingHandler = () => {
	let bookingDate = new Date(selectedDate);
	const bookingPromises = [];

	for (let i = 0; i < regularBookingLength; i++) {
		const data = {
			topic,
			name,
			selectedDate: bookingDate,
			selectedTime,
			endingTime,
		};

		const bookingPromise = bookingApi.create(data)
		.catch((error) => {
			console.error('Error creating a booking:', error);
			throw error;
		});

		bookingPromises.push(bookingPromise);
		bookingDate = getNextValidDay(bookingDate);
	}

	Promise.all(bookingPromises)
		.then(() => {
			// setLoading(false);
			// enqueueSnackbar('Booking created successfully', { variant: 'success' });
			// navigate('/');
			setShowConfirmWindow(false);
			setShowThanksWindow(true);
		})
		.catch ((error) => {
			// setLoading(false);
			// enqueueSnackbar('Error creating bookings', { variant: 'error' });
			console.error('Error creating a booking:', error);
			setShowErrorWindow(true);
		});
};

  const fetchBookings = () => {
	// Fetch bookings logic (removed for simplicity)
  };

  const handleBookingsUpdate = (updatedBookings) => {
	setBookings(updatedBookings);
  };

  const getBookingsByDate = () => {
		return bookings.filter((booking) => {
			const date = new Date(booking.selectedDate);
			return isSameDate(date, selectedDate);
		})
	};

  useEffect(() => {
	setNewBooking(false);
	setTopic("");
	setName("");
	disableBookedTimes(bookings, selectedDate, timeButtons);
	if (selectedDate) {
		setSelectedBookings(sortBookings(getBookingsByDate()))
		setTimeButtons(initTimes());
		setSelectedTime([]);
		setRegularBooking(false);
		setRegularBookingTimeformat(null);
		setRegularBookingLength(1);
		// fetchBookings();
	}
}, [bookings, selectedDate]);

  return (
	<div className="bookingpage-main">
	  <div className="bookingpage-content">
		<div className="calendar-times-content">
		  <Calendar date={selectedDate} setSelectedDate={setSelectedDate} />
		  { selectedDate && (
			  <TimeButton bookings={bookings} selectedDate={selectedDate}
						timeButtons={timeButtons} selectedTime={selectedTime}
					  setSelectedTime={setSelectedTime} setNewBooking={setNewBooking} />
		  )}
		</div>
		<div className="booking-content">
		  <div className="booking-data-content">
			{selectedDate && (
				<div className="booking-data">
					<div className="booking-headline">
					<label>{selectedDate.toLocaleDateString("fi-FI", options)}</label>
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
						className='regular-booking-checkbox'
						id='regular-booking-checkbox'/>
						<label className="regular-booking-checkbox"
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
						<BookingListPage onBookingsUpdate={handleBookingsUpdate}
										selectedDate={selectedDate}
										selectedBookings={selectedBookings}/>
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
				newBookingHandler();

				// setShowConfirmWindow(false);
				// setShowThanksWindow(true);
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
	  {showErrorWindow && (
		<div className="fullscreen-modal">
		  <div className="modal-thanks-content">
			<div className="thanks-label">
			  <label>Virhe!</label>
			</div>
			<div className="description-label">
			  <label>Aika ehdittiin varata!</label>
			</div>
		  </div>
		  <div className="modal-buttons">
			<button className="black-button" onClick={() => {
				setNewBooking(false);
				setShowErrorWindow(false);
				setShowThanksWindow(false);
			}}>
			  Tee uusi varaus
			</button>
		  </div>
		</div>
		)
	  }
	</div>
  );
};

export default BookingPage;
