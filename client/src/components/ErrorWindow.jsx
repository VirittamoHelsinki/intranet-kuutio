
const ErrorWindow = ({setNewBooking, setShowErrorWindow, setShowConfirmWindow}) => {
	return (
	<>
	<div className="fullscreen-modal">
	  <div className="modal-thanks-content">
		<div className="thanks-label">
		  <label>Virhe!</label>
		</div>
		<div className="description-label">
		  <label>Varaus epäonnistunut!</label>
		</div>
	  </div>
	  <div className="modal-buttons">
		<button className="black-button" onClick={() => {
			setNewBooking(false);
			setShowErrorWindow(false);
			setShowConfirmWindow(false);
		}}>
		  Tee uusi varaus
		</button>
	  </div>
	</div>
	</>
	)
}

export default ErrorWindow
