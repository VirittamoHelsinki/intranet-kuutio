import React, { useState, useEffect } from "react";
import { months, weekDays } from "../features/arrays";
import "../styles/Calendar.scss";

const Calendar = ({ date, setDate, setSelectedDate, highlightDays = [] }) => {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const isDateToday = (date) => {
	return (
		currentYear === date.getFullYear() &&
		currentMonth === date.getMonth() &&
		currentDay === date.getDate()
	);
  };

  const isDateSelected = (date) => {
	return (
		selectedYear === date.getFullYear() &&
		selectedMonth === date.getMonth() &&
		selectedDay === date.getDate()
	)
  };

  useEffect(() => {
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
    setDays(getDaysToDisplay(date.getFullYear(), date.getMonth()));
    setSelectedDay(date.getDate());
  }, [date]);

  const gotoPreviousMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, 1);
    setDate(newDate);
  };

  const gotoNextMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth + 1, 1);
    setDate(newDate);
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDay();
  };

  const getDaysInMonthAsArray = (year, month) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Array(lastDay).fill(0).map((_, i) => new Date(year, month, i + 1));
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
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const lastDaysOfPreviousMonth = getLastDaysOfPreviousMonth(year, month - 1, firstDayOfMonth);
    const daysInMonth = getDaysInMonthAsArray(year, month);
    const daysFromNextMonth = 42 - daysInMonth.length - lastDaysOfPreviousMonth.length;
    const firstDaysOfNextMonth = getFirstDaysOfNextMonth(year, month + 1, daysFromNextMonth);
    return [...lastDaysOfPreviousMonth, ...daysInMonth, ...firstDaysOfNextMonth];
  };

  const isDateSelectable = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set current date to midnight
    return day >= today;
  };

  return (
    <div className="minified-calendar">
      <div className="calendar-header">
        <div className="calendar-header-top">
          <label className="month-button" onClick={gotoPreviousMonth}>
            {months[selectedMonth - 1 < 0 ? 11 : selectedMonth - 1]}
          </label>
          <label className="month-label">
            {months[selectedMonth]} {selectedYear}
          </label>
          <label className="month-button" onClick={gotoNextMonth}>
            {months[selectedMonth + 1 > 11 ? 0 : selectedMonth + 1]}
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
            const isCurrentMonth = day.getMonth() === selectedMonth;
            const isSelectable = isDateSelectable(day);
			const isToday = isDateToday(day);
			const isSelected = isDateSelected(day);

            return (
				<div
                key={`day-${index}`}
                className={`calendar-day
				${ isCurrentMonth ? "" : "disabled"}
				${ isSelected ? "selected" : "" }
				${ highlightDays.includes(day.getTime()) ? "highlight" : ""}
				${ isToday ? "today" : ""}
				${ !isSelectable ? "not-selectable" : "" }`
			}
			onClick={() => {
				if (isCurrentMonth && isSelectable) {
					setSelectedDay(day.getDate());
                    setDate(new Date(selectedYear, selectedMonth, day.getDate()));
                    setSelectedDate(new Date(selectedYear, selectedMonth, day.getDate()));
                  } else {
                    window.alert("Valitse nykyinen tai tuleva varauksen päivämäärä.");
                  }
                }}
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
