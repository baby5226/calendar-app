import React from 'react';
import { Todo } from '../types';
import { formatDateDisplay } from '../utils/calendarUtils';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  todos: Todo[];
  onAddTodo: () => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string) => void;
  onToggleComplete: (todoId: string) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  date,
  todos,
  onAddTodo,
  onEditTodo,
  onDeleteTodo,
  onToggleComplete
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{formatDateDisplay(new Date(date))}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="todo-list">
          {todos.length === 0 ? (
            <p>這一天沒有待辦事項</p>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className={`todo-list-item ${
                  todo.isUrgent ? 'urgent' : ''
                } ${todo.isCompleted ? 'completed' : ''}`}
              >
                <div className="todo-info">
                  <div className="todo-title">
                    {todo.title}
                  </div>
                  {todo.description && (
                    <div className="todo-description">
                      {todo.description}
                    </div>
                  )}
                  {todo.reminderTime && (
                    <div className="todo-reminder">
                      提醒時間: {new Date(todo.reminderTime).toLocaleString('zh-TW')}
                    </div>
                  )}
                </div>
                
                <div className="todo-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onToggleComplete(todo.id)}
                  >
                    {todo.isCompleted ? '取消完成' : '標記完成'}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onEditTodo(todo)}
                  >
                    編輯
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDeleteTodo(todo.id)}
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="form-actions">
          <button className="btn btn-primary" onClick={onAddTodo}>
            新增待辦事項
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal; 