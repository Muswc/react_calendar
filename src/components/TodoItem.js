import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TodoItem = ({ task, onDelete, onToggle }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
      />
      <span
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          marginLeft: '8px'
        }}
      >
        {task.text}
      </span>
      <button
        className="delete-button"
        onClick={onDelete}
        aria-label="삭제"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default TodoItem;
