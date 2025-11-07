import type { Note, TodoItem, CalendarEvent } from '../types';

export interface AgentContext {
  notes: Note[];
  todos: TodoItem[];
  events: CalendarEvent[];
}

export interface AgentAction {
  type: 'create_note' | 'create_todo' | 'create_event' | 'update_todo' | 'none';
  data?: any;
}

export function analyzeUserIntent(message: string, context: AgentContext): {
  response: string;
  action: AgentAction;
} {
  const lowerMessage = message.toLowerCase();

  // Note creation
  if (
    lowerMessage.includes('create note') ||
    lowerMessage.includes('new note') ||
    lowerMessage.includes('add note')
  ) {
    const titleMatch = message.match(/(?:called|titled|named)\s+"([^"]+)"/i);
    const title = titleMatch ? titleMatch[1] : 'New Note from Chat';
    return {
      response: `I'll create a new note titled "${title}" for you!`,
      action: { type: 'create_note', data: { title } },
    };
  }

  // Todo creation
  if (
    lowerMessage.includes('create todo') ||
    lowerMessage.includes('new task') ||
    lowerMessage.includes('add task') ||
    lowerMessage.includes('remind me to')
  ) {
    const taskMatch = message.match(/(?:to|task:?)\s+(.+?)(?:\s+(?:with|by|on)|$)/i);
    const task = taskMatch ? taskMatch[1].trim() : 'New Task';
    const priorityMatch = message.match(/\b(high|medium|low)\s+priority\b/i);
    const priority = priorityMatch
      ? (priorityMatch[1].toLowerCase() as 'high' | 'medium' | 'low')
      : 'medium';

    return {
      response: `I'll create a ${priority} priority task: "${task}"`,
      action: { type: 'create_todo', data: { title: task, priority } },
    };
  }

  // Event creation
  if (
    lowerMessage.includes('create event') ||
    lowerMessage.includes('schedule') ||
    lowerMessage.includes('add to calendar')
  ) {
    const titleMatch = message.match(/(?:event|schedule|meeting)\s+(?:called|named)?\s*"?([^"]+)"?/i);
    const title = titleMatch ? titleMatch[1].trim() : 'New Event';
    return {
      response: `I'll help you create an event titled "${title}". Please use the calendar to set the exact time!`,
      action: { type: 'create_event', data: { title } },
    };
  }

  // Search notes
  if (lowerMessage.includes('find note') || lowerMessage.includes('search note')) {
    const searchMatch = message.match(/(?:find|search)\s+note\s+(?:about|for|with)?\s*"?([^"]+)"?/i);
    const searchTerm = searchMatch ? searchMatch[1].trim() : '';

    const foundNotes = context.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundNotes.length > 0) {
      return {
        response: `I found ${foundNotes.length} note(s) matching "${searchTerm}":\n\n${foundNotes
          .map((note) => `- ${note.title}`)
          .join('\n')}`,
        action: { type: 'none' },
      };
    } else {
      return {
        response: `I couldn't find any notes matching "${searchTerm}". Would you like to create a new one?`,
        action: { type: 'none' },
      };
    }
  }

  // List todos
  if (
    lowerMessage.includes('show todos') ||
    lowerMessage.includes('list tasks') ||
    lowerMessage.includes('what are my tasks')
  ) {
    const activeTodos = context.todos.filter((todo) => !todo.completed);
    if (activeTodos.length > 0) {
      return {
        response: `You have ${activeTodos.length} active task(s):\n\n${activeTodos
          .map((todo) => `- [${todo.priority}] ${todo.title}`)
          .join('\n')}`,
        action: { type: 'none' },
      };
    } else {
      return {
        response: "You don't have any active tasks. Great job staying on top of things!",
        action: { type: 'none' },
      };
    }
  }

  // List upcoming events
  if (
    lowerMessage.includes('upcoming events') ||
    lowerMessage.includes('what\'s on my calendar') ||
    lowerMessage.includes('my schedule')
  ) {
    const now = new Date();
    const upcomingEvents = context.events
      .filter((event) => new Date(event.start) > now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);

    if (upcomingEvents.length > 0) {
      return {
        response: `Here are your upcoming events:\n\n${upcomingEvents
          .map(
            (event) =>
              `- ${event.title} (${new Date(event.start).toLocaleDateString()})`
          )
          .join('\n')}`,
        action: { type: 'none' },
      };
    } else {
      return {
        response: "You don't have any upcoming events scheduled.",
        action: { type: 'none' },
      };
    }
  }

  // Summary
  if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
    const activeTodos = context.todos.filter((todo) => !todo.completed);
    const now = new Date();
    const upcomingEvents = context.events.filter(
      (event) => new Date(event.start) > now
    );

    return {
      response: `Here's your productivity overview:

📝 Notes: ${context.notes.length} total
✅ Tasks: ${activeTodos.length} active, ${context.todos.length - activeTodos.length} completed
📅 Events: ${upcomingEvents.length} upcoming

${
  activeTodos.length > 0
    ? `\nYour top priority tasks:\n${activeTodos
        .filter((t) => t.priority === 'high')
        .slice(0, 3)
        .map((t) => `- ${t.title}`)
        .join('\n')}`
    : ''
}`,
      action: { type: 'none' },
    };
  }

  // Default response
  return {
    response: `I'm your KiwiiLove productivity assistant! I can help you with:

- Creating and searching notes
- Managing your to-do list
- Scheduling calendar events
- Getting summaries and overviews

Try asking me to:
- "Create a note called 'Meeting Notes'"
- "Add a task to buy groceries"
- "Show my todos"
- "What's on my calendar?"
- "Give me a summary"

What would you like help with?`,
    action: { type: 'none' },
  };
}
