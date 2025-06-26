import React from 'react';
import { Todo } from '../types';
import { 
  hasTodosInMonth, 
  getMonthDaysWithTodos, 
  monthNames,
  formatDate 
} from '../utils/calendarUtils';

interface YearlyCalendarProps {
  currentDate: Date;
  todos: Record<string, Todo[]>;
  onMonthClick: (year: number, month: number) => void;
}

const YearlyCalendar: React.FC<YearlyCalendarProps> = ({
  currentDate,
  todos,
  onMonthClick
}) => {
  const currentYear = currentDate.getFullYear();

  const renderMonthGrid = (month: number) => {
    const daysWithTodos = getMonthDaysWithTodos(todos, currentYear, month);
    const days = [];
    
    // 建立一個月的日曆格子（簡化版）
    for (let day = 1; day <= 31; day++) {
      const dateStr = `${currentYear}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hasTodo = daysWithTodos.includes(dateStr);
      
      days.push(
        <div
          key={day}
          className={`year-month-day ${hasTodo ? 'has-todo' : ''}`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="yearly-view">
      {monthNames.map((monthName, monthIndex) => {
        const hasTodos = hasTodosInMonth(todos, currentYear, monthIndex + 1);
        
        return (
          <div
            key={monthIndex}
            className={`year-month ${hasTodos ? 'has-todos' : ''}`}
            onClick={() => onMonthClick(currentYear, monthIndex + 1)}
          >
            <div className="year-month-title">
              {monthName}
            </div>
            <div className="year-month-grid">
              {renderMonthGrid(monthIndex)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YearlyCalendar; 