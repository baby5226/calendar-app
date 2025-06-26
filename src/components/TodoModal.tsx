import React, { useState, useEffect } from 'react';
import { Todo } from '../types';
import { generateId } from '../utils/calendarUtils';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Todo) => void;
  todo?: Todo;
  selectedDate: string;
}

const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  todo,
  selectedDate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setReminderTime(todo.reminderTime || '');
      setIsUrgent(todo.isUrgent);
    } else {
      setTitle('');
      setDescription('');
      setReminderTime('');
      setIsUrgent(false);
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('請輸入待辦事項標題');
      return;
    }

    const newTodo: Todo = {
      id: todo?.id || generateId(),
      title: title.trim(),
      description: description.trim(),
      date: selectedDate,
      reminderTime: reminderTime || undefined,
      isCompleted: todo?.isCompleted || false,
      isUrgent,
      createdAt: todo?.createdAt || new Date().toISOString()
    };

    onSave(newTodo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{todo ? '編輯待辦事項' : '新增待辦事項'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">標題 *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="輸入待辦事項標題"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">描述</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="輸入待辦事項描述（選填）"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reminderTime">提醒時間</label>
            <input
              id="reminderTime"
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
              標記為緊急
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {todo ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal; 