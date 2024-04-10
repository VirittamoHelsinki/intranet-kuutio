import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fullName, initTimes } from "../features/functions";
import Calendar from "../components/Calendar";
import "../styles/BookingPage.scss";
import bookingApi from "../api/booking";
import BookingListPage from "../components/BookingListPage";
import { bookingTopics } from "../features/arrays";

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
	setSelectedTime([...selectedTime, booking.time]);
	setNewBooking(true);

	const button = timeButtons.find((button) => button.time === booking.time);
	if (button) {
		button.data = 'selected';
	}
};


  const handleButtonUnClick = (booking) => {
	const updatedTimes = selectedTime.filter(time => time != booking.time);
	setSelectedTime(updatedTimes);

	if (updatedTimes.length == 0) {
		setNewBooking(false);
	}

	const button = timeButtons.find((button) => button.time === booking.time);
	if (button) {
		button.data = 'available';
	}
  };

  const endingTime = (time) => {
	let [hour, minutes] = time.time.split(':').map(numString => parseInt(numString));

	if (minutes == 30) {
		minutes = 0;
		hour++;
	}
	else {
		minutes += 30;
	}

	const paddedMinutes = String(minutes).padStart(2, '0');
	return `${hour}:${paddedMinutes}`
  };

  const disableBookedTimes = () => {
	bookings.map(booking => {
		const bookingDate = new Date(booking.selectedDate);
		if (bookingDate.getTime() == selectedDate.getTime()) {
			const time = booking.selectedTime[0]
			const index = timeButtons.findIndex(button => button.time == time);

			if (index !== -1) {
				timeButtons[index].data = 'booked';
			}
		}
	});
};

const getPreviousTime = (time) => {
	let [hour, minutes] = time.split(':').map(numString => parseInt(numString));
	if (minutes == 30) {
		minutes = 0;
	}
	else {
		minutes = 30;
		hour--;
	}

	const paddedMinutes = String(minutes).padStart(2, '0');
	const paddedHour = String(hour).padStart(2, '0');
	return `${paddedHour}:${paddedMinutes}`
};

const openAdjacentTimes = () => {
	selectedTime.sort();
	const prevTime = getPreviousTime(selectedTime[0]);
	const nextTime = getEndingTime(selectedTime[selectedTime.length - 1]);

	timeButtons.map((button) => {
		if ((button.time == prevTime ||
			button.time == nextTime) &&
			button.data == 'locked') {
				button.data = 'available';
			}
	});
};

const disableNonAdjacentTimes = () => {
	const buttonsSelected = selectedTime.length;

	if (buttonsSelected) {
		if (buttonsSelected < 4) {
			timeButtons.map((button) => {
				if (button.data != 'selected' &&
					button.data != 'booked') {
						button.data = 'locked';
				}
			});
			openAdjacentTimes();
		}
		else {
			timeButtons.map((button) => {
				if (button.data == 'available') {
						button.data = 'locked';
					}
			});
		}
	}
	else {
		timeButtons.map((button) => {
			if (button.data != 'booked') {
				button.data = 'available';
			}
		});
	}
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
		// fetchBookings();
	}
	if (bookings.length > 0) {
		disableBookedTimes();
	}
}, [bookings, selectedDate]);

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
				{ disableBookedTimes() }
				{ disableNonAdjacentTimes() }
				{timeButtons.map((button, index) => {
					const disabled = button.data === 'booked' || button.data === 'locked';
					const isClicked = selectedTime.includes(button.time);
					return (
						<div
						className={`time-box
						${disabled ? " disabled" : ""}
						${(isClicked && !disabled) ? "selected" : ""}`}
						key={index}
						onClick={() => {
							if (!disabled) {
								if (!selectedTime.includes(button.time)) {
									handleButtonClick(button);
								}
								else {
									handleButtonUnClick(button);
								}
							}}}>
							{button.time}
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

					<div className="selected-time-header">
						<label>Olet varaamassa klo</label>
					</div>
					{/* change to show only the first time and ending time, not all -> 12.00 - 14.00 */}

					{selectedTime
					.sort()
					.map((time, index) => (
						<label key={index} className='selected-time'>{time} - {getEndingTime({time})}
						</label>
					))}
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
