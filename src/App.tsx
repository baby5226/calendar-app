import React, { useState, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { addMonths, subMonths, setMonth, setYear } from 'date-fns';
import { Todo, CalendarView } from './types';
import { formatDate, formatMonthDisplay } from './utils/calendarUtils';
import MonthlyCalendar from './components/MonthlyCalendar';
import YearlyCalendar from './components/YearlyCalendar';
import TodoModal from './components/TodoModal';
import DayDetailModal from './components/DayDetailModal';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>({ type: 'monthly' });
  const [todos, setTodos] = useState<Record<string, Todo[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();

  // 從 localStorage 載入資料
  useEffect(() => {
    const savedTodos = localStorage.getItem('calendar-todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('載入待辦事項失敗:', error);
      }
    }
  }, []);

  // 儲存到 localStorage
  useEffect(() => {
    localStorage.setItem('calendar-todos', JSON.stringify(todos));
  }, [todos]);

  // 處理提醒
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      Object.values(todos).flat().forEach(todo => {
        if (todo.reminderTime && !todo.isCompleted) {
          const reminderTime = new Date(todo.reminderTime);
          if (reminderTime <= now && reminderTime > new Date(now.getTime() - 60000)) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('待辦事項提醒', {
                body: todo.title,
                icon: '/favicon.ico'
              });
            } else {
              alert(`提醒: ${todo.title}`);
            }
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // 每30秒檢查一次
    return () => clearInterval(interval);
  }, [todos]);

  // 請求通知權限
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleViewToggle = (viewType: 'monthly' | 'yearly') => {
    setView({ type: viewType });
  };

  const handleTodoDrop = (result: DropResult) => {
    if (!result.destination) return;

    const sourceDate = result.source.droppableId;
    const destinationDate = result.destination.droppableId;
    const todoId = result.draggableId;

    if (sourceDate === destinationDate) return;

    setTodos(prevTodos => {
      const newTodos = { ...prevTodos };
      
      // 從來源日期移除
      const sourceTodos = [...(newTodos[sourceDate] || [])];
      const todoIndex = sourceTodos.findIndex(todo => todo.id === todoId);
      if (todoIndex !== -1) {
        const [movedTodo] = sourceTodos.splice(todoIndex, 1);
        newTodos[sourceDate] = sourceTodos;
        
        // 添加到目標日期
        const destinationTodos = [...(newTodos[destinationDate] || [])];
        movedTodo.date = destinationDate;
        destinationTodos.splice(result.destination.index, 0, movedTodo);
        newTodos[destinationDate] = destinationTodos;
      }
      
      return newTodos;
    });
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const handleTodoClick = (todo: Todo) => {
    setEditingTodo(todo);
    setShowTodoModal(true);
  };

  const handleSaveTodo = (todo: Todo) => {
    setTodos(prevTodos => {
      const newTodos = { ...prevTodos };
      const dateTodos = [...(newTodos[todo.date] || [])];
      
      const existingIndex = dateTodos.findIndex(t => t.id === todo.id);
      if (existingIndex !== -1) {
        dateTodos[existingIndex] = todo;
      } else {
        dateTodos.push(todo);
      }
      
      newTodos[todo.date] = dateTodos;
      return newTodos;
    });
    
    setEditingTodo(undefined);
    setShowTodoModal(false);
  };

  const handleDeleteTodo = (todoId: string) => {
    setTodos(prevTodos => {
      const newTodos = { ...prevTodos };
      Object.keys(newTodos).forEach(date => {
        newTodos[date] = newTodos[date].filter(todo => todo.id !== todoId);
      });
      return newTodos;
    });
  };

  const handleToggleComplete = (todoId: string) => {
    setTodos(prevTodos => {
      const newTodos = { ...prevTodos };
      Object.keys(newTodos).forEach(date => {
        newTodos[date] = newTodos[date].map(todo => 
          todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
        );
      });
      return newTodos;
    });
  };

  const handleMonthClick = (year: number, month: number) => {
    setCurrentDate(setMonth(setYear(currentDate, year), month - 1));
    setView({ type: 'monthly' });
  };

  const handleAddTodo = () => {
    setEditingTodo(undefined);
    setShowTodoModal(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowTodoModal(true);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={handlePreviousMonth}>
            上個月
          </button>
          <div className="calendar-title">
            {formatMonthDisplay(currentDate)}
          </div>
          <button onClick={handleNextMonth}>
            下個月
          </button>
        </div>
        
        <div className="view-toggle">
          <button
            className={view.type === 'monthly' ? 'active' : ''}
            onClick={() => handleViewToggle('monthly')}
          >
            月檢視
          </button>
          <button
            className={view.type === 'yearly' ? 'active' : ''}
            onClick={() => handleViewToggle('yearly')}
          >
            年檢視
          </button>
        </div>
      </div>

      {view.type === 'monthly' ? (
        <MonthlyCalendar
          currentDate={currentDate}
          todos={todos}
          onTodoDrop={handleTodoDrop}
          onDateClick={handleDateClick}
          onTodoClick={handleTodoClick}
        />
      ) : (
        <YearlyCalendar
          currentDate={currentDate}
          todos={todos}
          onMonthClick={handleMonthClick}
        />
      )}

      <TodoModal
        isOpen={showTodoModal}
        onClose={() => {
          setShowTodoModal(false);
          setEditingTodo(undefined);
        }}
        onSave={handleSaveTodo}
        todo={editingTodo}
        selectedDate={selectedDate || formatDate(currentDate)}
      />

      <DayDetailModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        date={selectedDate}
        todos={todos[selectedDate] || []}
        onAddTodo={handleAddTodo}
        onEditTodo={handleEditTodo}
        onDeleteTodo={handleDeleteTodo}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};

export default App; 