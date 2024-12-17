import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';
import Weather from './Weather';
import TrendingSearches from './TrendingSearches';
import Bookmark from './Bookmark';
import Quote from './Quote';
import 'react-calendar/dist/Calendar.css';
import '../styles.css';

const TodoList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : {};
  });
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const selectedTodos = todos[selectedDate.toDateString()] || [];

  const handleAddTodo = (text) => {
    const dateKey = selectedDate.toDateString();
    const newTodos = {
      ...todos,
      [dateKey]: [...(todos[dateKey] || []), { text, completed: false }]
    };
    setTodos(newTodos);
  };

  const handleDeleteTodo = (index) => {
    const dateKey = selectedDate.toDateString();
    const newTodos = {
      ...todos,
      [dateKey]: todos[dateKey].filter((_, i) => i !== index)
    };
    setTodos(newTodos);
  };

  const handleToggleTodo = (index) => {
    const dateKey = selectedDate.toDateString();
    const newTodos = {
      ...todos,
      [dateKey]: todos[dateKey].map((todo, i) => 
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    };
    setTodos(newTodos);
  };

  const getTodoStatus = ({ date }) => {
    const dateKey = date.toDateString();
    const todayTodos = todos[dateKey];
    
    if (!todayTodos || todayTodos.length === 0) {
      return 'none';  // 할 일 없음
    }
    
    const allCompleted = todayTodos.every(todo => todo.completed);
    return allCompleted ? 'completed' : 'active';  // 전체 완료 or 진행중
  };

  const handleViewChange = ({ activeStartDate }) => {
    setCalendarDate(activeStartDate);
  };

  const formatCalendarTitle = (date) => {
    const month = date.getMonth() + 1;
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    const year = date.getFullYear();
    return `${month}, ${monthName} ${year}`;
  };

  return (
    <div className="app-container">
      <button 
        className="theme-toggle" 
        onClick={() => setIsDark(!isDark)}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {isDark ? '🌞' : '🌙'}
      </button>

      <div className="app-content">
        <div className="left-panel">
          <Weather />
          <TrendingSearches />
        </div>

        <div className="center-panel">
          <div className="calendar-section">
            <h2 className="calendar-title">{formatCalendarTitle(calendarDate)}</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              locale="ko-KR"
              formatDay={(locale, date) => date.getDate()}
              calendarType="gregory"
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
              className="react-calendar"
              onActiveStartDateChange={handleViewChange}
              tileContent={({ date }) => {
                const status = getTodoStatus({ date });
                return status !== 'none' ? (
                  <div className={`todo-dot ${status}`}></div>
                ) : null;
              }}
            />
            <Quote />
          </div>
        </div>

        <div className="right-panel">
          <h3 className="todo-title">오늘의 할 일은?</h3>
          <div className="todo-list">
            <AddTodo onAdd={handleAddTodo} />
            {selectedTodos.map((todo, index) => (
              <TodoItem
                key={index}
                task={todo}
                onDelete={() => handleDeleteTodo(index)}
                onToggle={() => handleToggleTodo(index)}
              />
            ))}
          </div>
        </div>

        <div className="bottom-panel">
          <Bookmark />
        </div>
      </div>
    </div>
  );
};

export default TodoList;