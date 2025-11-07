import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarEvent } from '../types';

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: crypto.randomUUID(),
        };
        set((state) => ({ events: [...state.events, newEvent] }));
      },
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }));
      },
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },
      getEventsForDate: (date) => {
        const events = get().events;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return events.filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return eventStart <= endOfDay && eventEnd >= startOfDay;
        });
      },
    }),
    {
      name: 'kiwiilove-calendar',
    }
  )
);
