
const ConfirmWindow = ({topic, name, selectedDate, selectedTime, endingTime, regularBooking, setShowConfirmWindow, newBookingHandler, regularBookingLength, regularBookingTimeformat}) => {
  return (
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
	  <button className="black-button"
		  onClick={() => { newBookingHandler() }} >
		  Vahvista
	  </button>
	  <button className="nocolor-button" onClick={() => setShowConfirmWindow(false)}>
		Peruuta
	  </button>
	</div>
  </div>
  )
}

export default ConfirmWindow
