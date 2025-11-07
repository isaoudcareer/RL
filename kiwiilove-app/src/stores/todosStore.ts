import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TodoItem } from '../types';

interface TodosState {
  todos: TodoItem[];
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
}

export const useTodosStore = create<TodosState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (todo) => {
        const newTodo: TodoItem = {
          ...todo,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        }));
      },
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },
    }),
    {
      name: 'kiwiilove-todos',
    }
  )
);
