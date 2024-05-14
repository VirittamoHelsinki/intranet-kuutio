import { Link } from "react-router-dom";

const ThanksWindow = ({setNewBooking, setShowThanksWindow}) => {
	return (
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
  )
}

export default ThanksWindow