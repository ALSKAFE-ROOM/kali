import React, { useState } from 'react';
import './Calendar.css';

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get current date details
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  
  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIndex - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIndex + 1, 1));
  };
  
  // Generate dates for the calendar
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    // Array to hold all calendar day elements
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthIndex, day);
      const isSelected = selectedDate && 
                         date.getDate() === selectedDate.getDate() && 
                         date.getMonth() === selectedDate.getMonth() && 
                         date.getFullYear() === selectedDate.getFullYear();
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => onDateChange(date)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  // Format the month and year display
  const formatMonthYear = () => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).format(currentMonth);
  };
  
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="calendar-button">
          &lt;
        </button>
        <div className="calendar-month-year">
          {formatMonthYear()}
        </div>
        <button onClick={goToNextMonth} className="calendar-button">
          &gt;
        </button>
      </div>
      
      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="calendar-days">
        {generateCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;