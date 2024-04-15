import { disableBookedTimes, disableNonAdjacentTimes,
	handleButtonUnClick, handleButtonClick }
		from "../components/BookingPageFunctions";

const TimeButton = ( {bookings, selectedDate, timeButtons, selectedTime, setSelectedTime, setNewBooking} ) => {
return (
	<div className="times-content">
		<div className="times-headline">
			<label>Ajat</label>
		</div>

		<div className="times-row">
			{ disableBookedTimes(bookings, selectedDate, timeButtons) }
			{ disableNonAdjacentTimes(selectedTime, timeButtons) }
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
								handleButtonClick(button, selectedTime, timeButtons,
												setSelectedTime, setNewBooking);
							}
							else {
								handleButtonUnClick(button, selectedTime, timeButtons,
												setSelectedTime, setNewBooking);
							}
						}}}>
						{button.time}
					</div>
				);
			})}
		</div>
	</div>
)
}

export default TimeButton