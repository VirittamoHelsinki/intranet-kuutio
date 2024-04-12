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
