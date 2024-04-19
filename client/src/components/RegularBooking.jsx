import React, { useState, useEffect } from 'react'
import "../styles/RegularBooking.scss"

const RegularBooking = ({ selectedDate, selectedTime, bookings, onRegularLengthChange, timeformat, onTimeformatChange}) => {
	const [collision, setCollision] = useState(null);
	const [lenAvailable, setLenAvailable] = useState(0);
	const [radioButtons, setRadioButtons] = useState([false, false]);
	const [regularLength, setRegularLength] = useState(1);

	useEffect(() => {
		checkRegularBookingAvailability(0);
		setRegularLength(1);
		onRegularLengthChange(1);
	}, [selectedTime, radioButtons])

	const isSameDate = (date1, date2) => {
		if (date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() == date2.getDate()) {
				return true;
			}
		return false;
	}

	const checkDaysAvailable = () => {
		const upperLimit = 363;
		let daysAvailable = 1;
		let collisionFound = false;
		let dateToCheck = new Date();
		dateToCheck.setDate(selectedDate.getDate());

		for (let i = 0; i < upperLimit; i++) {
			dateToCheck.setDate(dateToCheck.getDate() + 1);

			// skip weekends
			const weekday = dateToCheck.getDay();
			if (weekday == 0 || weekday == 6) {
				continue;
			}

			if (checkCollision(bookings, dateToCheck)) {
				setLenAvailable(daysAvailable);
				onTimeformatChange(daysAvailable == 1 ? 'arkipäivä' : 'arkipäivää');
				collisionFound = true;
				return ;
			}
			// check last booking to prevent extra checkCollision()
			// if bookings[-1] < dateToCheck ? daysAvailable = upperLimit

			daysAvailable++;
		}
		if (!collisionFound) {
			setLenAvailable(daysAvailable);
			onTimeformatChange(daysAvailable == 1 ? 'arkipäivä' : 'arkipäivää');
			setCollision(null);
		}
	};

	const checkCollision = (bookings, dateToCheck) => {
		return bookings.some((booking) => {
			const bookingDate = new Date(booking.selectedDate);

			if (isSameDate(bookingDate, dateToCheck)) {
				for (let i = 0; i < booking.selectedTime.length; i++) {
					if (selectedTime.includes(booking.selectedTime[i])) {
						const collision = `${bookingDate.getDate()}.${bookingDate.getMonth()}.${bookingDate.getFullYear()} klo ${booking.selectedTime[i]}`

						setCollision(collision);
						return true;
					}
				}
			}
			return false;
		});
	};

	const checkWeeksAvailable = () => {
		const upperLimit = 51;
		let weeksAvailable = 1;
		let collisionFound = false;
		let dateToCheck = new Date();
		dateToCheck.setDate(selectedDate.getDate());

		for (let i = 0; i < upperLimit; i++) {
			dateToCheck.setDate(dateToCheck.getDate() + 7);

			if (checkCollision(bookings, dateToCheck)) {
				setLenAvailable(weeksAvailable);
				onTimeformatChange(weeksAvailable == 1 ? 'viikko' : 'viikkoa');
				collisionFound = true;
				return ;
			}
			// check last booking to prevent extra checkCollision()
			// if bookings[-1] < dateToCheck ? weeksAvailable = upperLimit

			weeksAvailable++;
		};
		if (!collisionFound) {
			setLenAvailable(weeksAvailable);
			onTimeformatChange(weeksAvailable == 1 ? 'viikko' : 'viikkoa');
			setCollision(null);
		}
	};

	const checkRegularBookingAvailability = (days) => {
		console.log('checkRegularBookingAvailability');

		if (days == 1 || radioButtons[0]) {
			setRadioButtons[true, false];
			return checkWeeksAvailable();
		}
		else if (days == 5 || radioButtons[1]) {
			setRadioButtons[false, true];
			return checkDaysAvailable();
		}
	};

	const handleRadioButtons = (index) => {
		const updatedRadioButtons = [...radioButtons];
		updatedRadioButtons.fill(false);
		updatedRadioButtons[index] = true;
		setRadioButtons(updatedRadioButtons);
		setRegularLength(1);
		onRegularLengthChange(1);
	};

	const handleBookingLength = (event) => {
		const value = event.target.value;
		onRegularLengthChange(value);
		setRegularLength(value);
	};

	return (
		<div className="regular-booking-container">
			<form className="regular-booking-form">
				<label htmlFor="">Pituus:</label>
				<input type="number" id="regular-len" min="1" max={lenAvailable}
				value={regularLength}
				onChange={handleBookingLength}></input>

				<input name='regular-time' type="radio" id='weekly' value='viikkoa'
				onChange={() => (handleRadioButtons(0))}
				onClick={() => checkRegularBookingAvailability(1)}
				checked={radioButtons[0]} />
				<label htmlFor="weekly">viikkoa</label>

				<input name='regular-time' type="radio" id='daily' value='arkipäivää'
				onChange={() => (handleRadioButtons(1))}
				onClick={() => checkRegularBookingAvailability(5)}
				checked={radioButtons[1]} />
				<label htmlFor="daily">arkipäivää</label>
			</form>
			<div className='booking-collision-info'>
				<div>
					<label className='booking-length'>
						Varattavissa: { lenAvailable } { timeformat }
					</label>
				</div>
				{ collision && (
					<div className='booking-collision'>
						<label htmlFor="">
							Päällekkäinen varaus: {collision}
						</label>
					</div>
				)}
			</div>
		</div>
	)
}

export default RegularBooking
