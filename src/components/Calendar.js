import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TodoList from './TodoList';
import Weather from './Weather';
import '../styles/Calendar.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState({});

  const addTodo = (task) => {
    const dateString = date.toDateString();
    setTodos({
      ...todos,
      [dateString]: [...(todos[dateString] || []), task],
    });
  };

  return (
    <div className="app-container">
      <div className="calendar-section">
        <Weather />
        <div className="calendar-container">
          <Calendar 
            onChange={setDate} 
            value={date}
            calendarType="US"
            formatDay={(locale, date) => date.getDate()}
          />
        </div>
      </div>
      <div className="todo-section">
        <h2>
          <span className="todo-date">
            {date.toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric'
            })}
          </span>
          오늘의 할 일은?
        </h2>
        <TodoList todos={todos[date.toDateString()] || []} onAdd={addTodo} />
      </div>
    </div>
  );
};

export default CalendarComponent; 