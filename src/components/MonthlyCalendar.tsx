import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Todo } from '../types';
import { 
  getMonthDays, 
  isCurrentMonth, 
  isCurrentDay, 
  formatDate, 
  getTodosForDate,
  weekDays 
} from '../utils/calendarUtils';

interface MonthlyCalendarProps {
  currentDate: Date;
  todos: Record<string, Todo[]>;
  onTodoDrop: (result: DropResult) => void;
  onDateClick: (date: string) => void;
  onTodoClick: (todo: Todo) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  currentDate,
  todos,
  onTodoDrop,
  onDateClick,
  onTodoClick
}) => {
  const days = getMonthDays(currentDate);

  const handleDragEnd = (result: DropResult) => {
    onTodoDrop(result);
  };

  return (
    <div className="monthly-calendar">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="calendar-grid">
          {/* 星期標題 */}
          {weekDays.map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          
          {/* 日期格子 */}
          {days.map((date, index) => {
            const dateStr = formatDate(date);
            const dayTodos = getTodosForDate(todos, dateStr);
            const isCurrentMonthDay = isCurrentMonth(date, currentDate);
            const isToday = isCurrentDay(date);
            
            return (
              <Droppable droppableId={dateStr} key={dateStr}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`calendar-day ${
                      !isCurrentMonthDay ? 'other-month' : ''
                    } ${isToday ? 'today' : ''} ${
                      snapshot.isDraggingOver ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => onDateClick(dateStr)}
                  >
                    <div className="day-number">
                      {date.getDate()}
                    </div>
                    
                    {dayTodos.length > 0 && (
                      <div className="todo-count">
                        {dayTodos.length}
                      </div>
                    )}
                    
                    {dayTodos.slice(0, 3).map((todo, todoIndex) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={todoIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`todo-item ${
                              todo.isUrgent ? 'urgent' : ''
                            } ${todo.isCompleted ? 'completed' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTodoClick(todo);
                            }}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.5 : 1
                            }}
                          >
                            {todo.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    
                    {dayTodos.length > 3 && (
                      <div className="todo-item">
                        +{dayTodos.length - 3} 更多
                      </div>
                    )}
                    
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default MonthlyCalendar; 