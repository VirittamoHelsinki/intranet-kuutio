import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "../components/Calendar";
import { fullName, getValueOf } from "../features/functions";
import { weekDaysLong } from "../features/arrays";
import "../styles/ManagePage.scss";

const AdminManagePage = () => {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  const [selected, setSelected] = useState({});
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSelected, setShowSelected] = useState(false);
  const [showConfirmWindow, setShowConfirmWindow] = useState(false);
  const [showReturnWindow, setShowReturnWindow] = useState(false);

  const { user } = UserAuth();

  const fetchBookings = async () => {
    try {
      setAllBookings([]);
      setBookings([]);
      const users = [];
      const userSnapshot = await getDocs(collection(db, "users"));
      userSnapshot.forEach((user) => {
        users.push({ id: user.id, email: user.data().email });
      });
      users.forEach(async (user) => {
        const docSnapshot = await getDocs(collection(db, "users", user.id, "bookings"));
        docSnapshot.forEach((doc) => {
          setAllBookings((oldBookings) => [...oldBookings, { ...doc.data(), email: user.email, uid: user.id, bookingId: doc.id }]);
          setBookings((oldBookings) => [...oldBookings, { ...doc.data(), email: user.email, uid: user.id, bookingId: doc.id }]);
        });
      });
    } catch (error) {
      window.alert("Ongelmia tietokannasta hakemisessa:\n\n" + error);
    }
  };

  const deleteBooking = async () => {
    try {
      /* delete booking from the users folder */
      await deleteDoc(doc(db, "users", selected.uid, "bookings", selected.bookingId));

      /* get bookings from specific day, find the right index, change the data to null and send it back to db */
      const docSnap = await getDoc(doc(db, "bookings", selected.year, selected.month, selected.day));
      const documents = [];
      let i = 0;
      while (docSnap.data()[i]) {
        documents.push(docSnap.data()[i]);
        i++;
      }
      const index = documents.findIndex((booking) => booking.time === selected.time);
      documents[index].data = null;
      await setDoc(doc(db, "bookings", selected.year, selected.month, selected.day), {
        ...documents,
      });
      setBookings(bookings.filter((booking) => booking.bookingId !== selected.bookingId));
      await setDoc(
        doc(db, "logs", new Date().toJSON().slice(0, 10)),
        {
          [new Date().toLocaleTimeString("en-GB")]: user.uid + " deleted booking " + selected.bookingId,
        },
        { merge: true }
      );
    } catch (error) {
      window.alert("Ongelmia tietokannassa:\n\n" + error);
    }
  };

  useEffect(() => {
    if (!user.uid) {
      return;
    }
    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear().toString();
      const month = selectedDate.getMonth().toString();
      const day = selectedDate.getDate().toString();
      setBookings(allBookings.filter((booking) => booking.year === year && booking.month === month && booking.day === day));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (allBookings.length > 0) {
      console.log(allBookings);
      const highlightDays = [];
      allBookings.forEach((booking) => {
        highlightDays.push(new Date(booking.year, booking.month, booking.day).getTime());
      });
      setHighlighted(highlightDays);
    }
  }, [allBookings]);

  return (
    <div className="managepage-main">
      <div className="managepage-content">
        <div className="upcoming-content">
          <div className="upcoming-title-bookings">
            <div className="upcoming-title">
              <label>Kaikki ajanvaraukset</label>
            </div>
            <div className="upcoming-bookings">
              {bookings
                .filter((booking) => getValueOf(booking) > new Date().valueOf())
                .sort((a, b) => (a.bookingId < b.bookingId ? -1 : a.bookingId > b.bookingId ? 1 : 0))
                .map((booking, index) => {
                  return (
                    <div
                      className={`booking-content ${booking.bookingId === selected.bookingId ? " selected" : ""}`}
                      key={index}
                      onClick={() => {
                        setSelected(booking);
                        setShowSelected(true);
                      }}
                    >
                      <div className="date-title-content">
                        <label>{weekDaysLong[booking.weekday]}</label>
                        <label>
                          {booking.day}/{parseInt(booking.month) + 1}/{booking.year}
                        </label>
                      </div>
                      <div className="time-topic-content">
                        <div className="time-box">{booking.time}</div>
                        <div className="topic-label">
                          <label>{booking.topic}</label>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="homepage-button-content">
            <Link to="/" className="homepage-button">
              Palaa etusivulle
            </Link>
          </div>
        </div>
        <div className="selected-main">
          <Calendar date={date} setDate={setDate} setSelectedDate={setSelectedDate} highlightDays={highlighted} />
          {showSelected && (
            <div className="selected-content">
              <div className="selected-details">
                <div className="selected-title">
                  <label>Varaus:</label>
                </div>
                <div className="text-row">
                  <div className="text-subject">
                    <label>Päivä:</label>
                  </div>
                  <div className="text-value">
                    <label>
                      {selected.day}/{parseInt(selected.month) + 1}/{selected.year}
                    </label>
                  </div>
                </div>
                <div className="text-row">
                  <div className="text-subject">
                    <label>Aihe:</label>
                  </div>
                  <div className="text-value">
                    <label>{selected.topic}</label>
                  </div>
                </div>
                <div className="text-row">
                  <div className="text-subject">
                    <label>Aika:</label>
                  </div>
                  <div className="text-value">
                    <label>{selected.time}</label>
                  </div>
                </div>
                <div className="text-row">
                  <div className="text-subject">
                    <label>Varaaja:</label>
                  </div>
                  <div className="text-value">
                    <label>{fullName(selected.email)}</label>
                  </div>
                </div>
              </div>
              <div className="remove-button-content">
                <button className="remove-button" onClick={() => setShowConfirmWindow(true)}>
                  Poista varaus
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showConfirmWindow && (
        <div className="fullscreen-modal">
          <div className="modal-detail-content">
            <label>Haluatko varmasti poistaa varauksen?</label>
          </div>
          <div className="modal-buttons">
            <button
              className="black-button"
              onClick={() => {
                deleteBooking();
                setShowSelected(false);
                setShowConfirmWindow(false);
                setShowReturnWindow(true);
              }}
            >
              Kyllä
            </button>
            <button className="nocolor-button" onClick={() => setShowConfirmWindow(false)}>
              Peruuta
            </button>
          </div>
        </div>
      )}
      {showReturnWindow && (
        <div className="fullscreen-modal">
          <div className="modal-detail-content">
            <label>Ajanvaraus poistettu!</label>
          </div>
          <div className="modal-buttons">
            <button className="black-button" onClick={() => setShowReturnWindow(false)}>
              Jatka hallinnointia
            </button>
            <Link to="/">
              <button className="nocolor-button" onClick={() => setShowReturnWindow(false)}>
                Takaisin etusivulle
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagePage;
