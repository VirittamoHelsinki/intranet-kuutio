import { useState, useEffect } from "react";
import { months, weekDays } from "../features/arrays";
import "../styles/Calendar.scss";

const Calendar = ({ date, setDate, setSelectedDate, highlightDays = [] }) => {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear());

  useEffect(() => {
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
    setDays(getDaysToDisplay(date.getFullYear(), date.getMonth()));

    const firstDayOfMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
    const lastDaysOfPreviousMonth = getLastDaysOfPreviousMonth(date.getFullYear(), date.getMonth() - 1, firstDayOfMonth);
    setSelectedDay(date.getDate() + lastDaysOfPreviousMonth.length - 2);
  }, [date]);

  useEffect(() => {
    const firstDayOfMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
    const lastDaysOfPreviousMonth = getLastDaysOfPreviousMonth(date.getFullYear(), date.getMonth() - 1, firstDayOfMonth);
    if (selectedDay !== null && selectedDay !== date.getDate() + lastDaysOfPreviousMonth.length - 2) {
      setDate(new Date(date.getFullYear(), date.getMonth(), selectedDay - (getFirstDayOfMonth(currentYear, currentMonth) - 2)));
      setSelectedDate(new Date(date.getFullYear(), date.getMonth(), selectedDay - (getFirstDayOfMonth(currentYear, currentMonth) - 2)));
    }
  }, [selectedDay]);

  const changeMonth = (month) => {
    let year = currentYear;
    if (month > 11) {
      month = 0;
      year++;
    }
    if (month < 0) {
      month = 11;
      year--;
    }
    setDate(new Date(year, month, date.getDate()));
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysInMonthAsArray = (year, month) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Array(lastDay).fill(0).map((_, i) => new Date(year, month, i + 1));
  };

  const getTrueDay = (date) => {
    let day = date.getDay();
    if (day === 0) return 6;
    return day - 1;
  };

  const getLastDaysOfPreviousMonth = (year, month, howManyDays) => {
    const days = [];
    const lastDayOfPreviousMonth = new Date(year, month + 1, 0).getDate();
    for (let i = lastDayOfPreviousMonth - howManyDays; i < lastDayOfPreviousMonth; i++) {
      days.push(new Date(year, month, i + 1));
    }
    return days;
  };

  const getFirstDaysOfNextMonth = (year, month, howManyDays) => {
    const days = [];
    for (let i = 1; i <= howManyDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getDaysToDisplay = (year, month) => {
    // Get the first day of the month
    const firstDayOfMonth = getTrueDay(new Date(year, month, 1));

    // Get list of the last days in the previous month (to fill the first row)
    const lastDaysOfPreviousMonth = getLastDaysOfPreviousMonth(year, month - 1, firstDayOfMonth);

    // Get the bulk of the days in the current month
    const daysInMonth = getDaysInMonthAsArray(year, month);

    // Merge first row with the bulk of the days
    let days = [...lastDaysOfPreviousMonth, ...daysInMonth];

    // Calculate how many days are needed to fill the last row
    const daysFromNextMonth = 42 - days.length;

    // Get the first days of the next month (to fill the last row)
    const firstDaysOfNextMonth = getFirstDaysOfNextMonth(year, month + 1, daysFromNextMonth);

    // Merge the last row with the bulk of the days
    days = [...days, ...firstDaysOfNextMonth];
    return days;
  };

  return (
    <div className="minified-calendar">
      <div className="calendar-header">
        <div className="calendar-header-top">
          <label className="month-button" onClick={() => changeMonth(currentMonth - 1)}>
            {months[currentMonth - 1]}
          </label>
          <label className="month-label">
            {months[currentMonth]} {currentYear}
          </label>
          <label className="month-button" onClick={() => changeMonth(currentMonth + 1)}>
            {months[currentMonth + 1]}
          </label>
        </div>
        <div className="calendar-header-bottom">
          {weekDays.map((day, i) => (
            <div key={i} className="calendar-header-day">
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-body">
        <div className="calendar-days">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const highlight = new Date().getTime() < day.getTime() && highlightDays.includes(day.getTime());
            return (
              <div
                key={`day-${index}`}
                className={`calendar-day ${selectedDay === index ? "selected" : ""} ${!isCurrentMonth ? "disabled" : ""}${highlight ? " highlight" : ""}`}
                onClick={() => setSelectedDay(index)}
              >
                <p>{day.getDate()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
