import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Todo } from '../types';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDateDisplay = (date: Date): string => {
  return format(date, 'yyyy年MM月dd日', { locale: zhTW });
};

export const formatMonthDisplay = (date: Date): string => {
  return format(date, 'yyyy年MM月', { locale: zhTW });
};

export const getMonthDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  // 取得當月所有日期
  const monthDays = eachDayOfInterval({ start, end });
  
  // 計算需要顯示的前後月份日期
  const firstDayOfWeek = getDay(start);
  const lastDayOfWeek = getDay(end);
  
  const prevMonthDays: Date[] = [];
  const nextMonthDays: Date[] = [];
  
  // 前一個月的日期
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(start);
    prevDate.setDate(start.getDate() - (i + 1));
    prevMonthDays.push(prevDate);
  }
  
  // 下一個月的日期
  for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
    const nextDate = new Date(end);
    nextDate.setDate(end.getDate() + i);
    nextMonthDays.push(nextDate);
  }
  
  return [...prevMonthDays, ...monthDays, ...nextMonthDays];
};

export const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
  return isSameMonth(date, currentDate);
};

export const isCurrentDay = (date: Date): boolean => {
  return isToday(date);
};

export const getTodosForDate = (todos: Record<string, Todo[]>, date: string): Todo[] => {
  return todos[date] || [];
};

export const getTodoCountForDate = (todos: Record<string, Todo[]>, date: string): number => {
  return getTodosForDate(todos, date).length;
};

export const hasTodosInMonth = (todos: Record<string, Todo[]>, year: number, month: number): boolean => {
  const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
  return Object.keys(todos).some(date => date.startsWith(monthStr));
};

export const getMonthDaysWithTodos = (todos: Record<string, Todo[]>, year: number, month: number): string[] => {
  const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
  return Object.keys(todos).filter(date => date.startsWith(monthStr));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
]; 