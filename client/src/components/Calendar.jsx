import React, { useState, useEffect } from "react";
import { months, weekDays } from "../features/arrays";
import "../styles/Calendar.scss";

const Calendar = ({ date, setSelectedDate, highlightDays = [] }) => {
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

  const gotoPreviousMonth = (day) => {
	let newDate;

	// currentmonth, set to today
	if (selectedMonth == currentMonth + 1 &&
		selectedYear == currentYear) {
			if (day > currentDay) {
				newDate = new Date(currentYear, currentMonth, day);
			}
			else {
				newDate = new Date(currentYear, currentMonth, currentDay);
			}
	}
	// future
	else if ( (selectedMonth > currentMonth + 1 && selectedYear >= currentYear)
			|| (selectedYear > currentYear) ) {
		newDate = new Date(selectedYear, selectedMonth - 1, day);
	}
	// history, unselectable
	else {
		newDate = new Date(currentYear, currentMonth, currentDay);
		// add alert?
	}
    setSelectedDate(newDate);
  };

  const gotoNextMonth = (day) => {
	  const newDate = new Date(selectedYear, selectedMonth + 1, day);
	  setSelectedDate(newDate);
  };

  const gotoToday = () => {
	const today = new Date(currentYear, currentMonth, currentDay);
	setSelectedDate(today);
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

  const isSelectablePreviousMonth = (day) => {
	const year = day.getFullYear();
	const month = day.getMonth();

	if (year > currentYear ||
		year == currentYear && month >= currentMonth && day.getDate() >= currentDay) {
		return true;
	}
	return false;
};

const isSelectableNextMonth = (day) => {
	const year = day.getFullYear();
	const month = day.getMonth();

	if (year > selectedYear ||
		year == selectedYear && month > selectedMonth) {
		return true;
	}
	return false;
  };

  return (
    <div className="minified-calendar">
      <div className="calendar-header">
		<button className="today-button" onClick={gotoToday}>Tänään</button>
        <div className="calendar-header-top">
          <label className="month-button" onClick={() => gotoPreviousMonth(1)}>
            {months[selectedMonth - 1 < 0 ? 11 : selectedMonth - 1]}
          </label>
          <label className="month-label">
            {months[selectedMonth]} {selectedYear}
          </label>
          <label className="month-button" onClick={() => gotoNextMonth(1)}>
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
			const isNextMonth = isSelectableNextMonth(day);
			const isSelectablePrevMonth = isSelectablePreviousMonth(day);

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
                    setSelectedDate(new Date(selectedYear, selectedMonth, day.getDate()));
                  }
				else if (isSelectable && isNextMonth) {
					gotoNextMonth(day.getDate());
				}
				else if (isSelectablePrevMonth) {
					gotoPreviousMonth(day.getDate());
				}
				else {
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
