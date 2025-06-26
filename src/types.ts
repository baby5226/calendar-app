export interface Todo {
  id: string;
  title: string;
  description?: string;
  date: string;
  reminderTime?: string;
  isCompleted: boolean;
  isUrgent: boolean;
  createdAt: string;
}

export interface CalendarView {
  type: 'monthly' | 'yearly';
}

export interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  todos: Record<string, Todo[]>;
  selectedDate?: string;
  showModal: boolean;
  editingTodo?: Todo;
} 