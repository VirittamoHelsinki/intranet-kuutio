export const disableBookedTimes = (bookings, selectedDate, timeButtons) => {
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

const addTimePadding = (hour, minute) => {
	const paddedMinute = String(minute).padStart(2, '0');
	const paddedHour = String(hour).padStart(2, '0');
	return `${paddedHour}:${paddedMinute}`;
};

const parseHourMinutesFromTime = (time) => {
	let hour, minutes;
	if (typeof time === 'string') {
		[hour, minutes] = time.split(':').map(numString => parseInt(numString));
	}
	else {
		[hour, minutes] = time.time.split(':').map(numString => parseInt(numString));
	}
	return [hour, minutes];
};

const getPreviousTime = (time) => {
	let [hour, minutes] = parseHourMinutesFromTime(time);
	if (minutes == 30) {
		minutes = 0;
	}
	else {
		minutes = 30;
		hour--;
	}
	return addTimePadding(hour, minutes);
};

export const getEndingTime = (time) => {
	let [hour, minutes] = parseHourMinutesFromTime(time);

	if (minutes == 30) {
		minutes = 0;
		hour++;
	}
	else {
		minutes += 30;
	}
	return addTimePadding(hour, minutes);
};

const getAdjacentTimes = (selectedTime) => {
	selectedTime.sort();
	const prevTime = getPreviousTime(selectedTime[0]);
	const nextTime = getEndingTime(selectedTime[selectedTime.length - 1]);
	return [prevTime, nextTime];
};

const openAdjacentTimes = (selectedTime, timeButtons) => {
	const [prevTime, nextTime] = getAdjacentTimes(selectedTime);

	timeButtons.map((button) => {
		if ((button.time == prevTime ||
			button.time == nextTime) &&
			button.data == 'locked') {
				button.data = 'available';
			}
	});
};

const lockUnselectedTimes = (timeButtons) => {
	timeButtons.map((button) => {
		if (button.data != 'selected' &&
			button.data != 'booked') {
				button.data = 'locked';
		}
	});
};

const lockAvailableTimes = (timeButtons) => {
	timeButtons.map((button) => {
		if (button.data == 'available') {
				button.data = 'locked';
			}
	});
};

const openUnbookedTimes = (timeButtons) => {
	timeButtons.map((button) => {
		if (button.data != 'booked') {
			button.data = 'available';
		}
	});
};

export const disableNonAdjacentTimes = (selectedTime, timeButtons) => {
	const buttonsSelected = selectedTime.length;
	const bookingLimit = 4;

	if (buttonsSelected) {
		if (buttonsSelected < bookingLimit) {
			lockUnselectedTimes(timeButtons);
			openAdjacentTimes(selectedTime, timeButtons);
		}
		else {
			lockAvailableTimes(timeButtons);
		}
	}
	else {
		openUnbookedTimes(timeButtons);
	}
};

const isFirstOrLastTime = (time, selectedTime) => {
	const firstTime = selectedTime[0];
	const lastTime = selectedTime[selectedTime.length - 1];

	return (time == firstTime || time == lastTime)
};

export const handleButtonUnClick = (booking, selectedTime, timeButtons, setSelectedTime, setNewBooking) => {
	if (isFirstOrLastTime(booking.time, selectedTime)) {
		const updatedTimes = selectedTime.filter(time => time != booking.time);
		setSelectedTime(updatedTimes);

		if (updatedTimes.length == 0) {
			setNewBooking(false);
		}

		const button = timeButtons.find((button) => button.time === booking.time);
		if (button) {
			button.data = 'available';
		}
	}
	else {
		// add alert, select only first/last time
	}
  };

  export const handleButtonClick = (booking, selectedTime, timeButtons, setSelectedTime, setNewBooking) => {
	setSelectedTime([...selectedTime, booking.time]);
	setNewBooking(true);

	const button = timeButtons.find((button) => button.time === booking.time);
	if (button) {
		button.data = 'selected';
	}
};
