# KiwiiLove Productivity App

A modern, feature-rich productivity application built with React, TypeScript, and Tailwind CSS. KiwiiLove combines notes, to-dos, calendar, and an AI assistant in one seamless experience.

## Features

### 📝 Notes (Notion-like Editor)
- Rich text editor with formatting options
- Bold, italic, headings, and lists
- Real-time saving to local storage
- Search and filter notes
- Clean, distraction-free writing experience

### ✅ To-Do List
- Create tasks with priorities (low, medium, high)
- Mark tasks as complete
- Filter by all, active, or completed tasks
- Automatic sorting by priority and completion status
- Track creation dates

### 📅 Calendar
- Month view with day-by-day event display
- Create, view, and delete events
- Set event times and descriptions
- Visual indicators for today and current month
- Easy navigation between months

### 🤖 AI Assistant
- Intelligent chatbot that understands your productivity needs
- Create notes, tasks, and events through natural language
- Search and query your data
- Get summaries and overviews
- Context-aware responses based on your current data

#### AI Commands Examples:
- "Create a note called 'Meeting Notes'"
- "Add a high priority task to finish the report"
- "Show my todos"
- "What's on my calendar?"
- "Give me a summary"
- "Find note about project"

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Rich Text Editor**: TipTap
- **State Management**: Zustand with persistence
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
cd kiwiilove-app
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
kiwiilove-app/
├── src/
│   ├── components/
│   │   ├── Calendar/
│   │   │   └── CalendarView.tsx
│   │   ├── Chat/
│   │   │   └── ChatView.tsx
│   │   ├── Layout/
│   │   │   ├── MainLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── Notes/
│   │   │   ├── NoteEditor.tsx
│   │   │   └── NotesView.tsx
│   │   └── Todo/
│   │       └── TodosView.tsx
│   ├── stores/
│   │   ├── appStore.ts
│   │   ├── calendarStore.ts
│   │   ├── chatStore.ts
│   │   ├── notesStore.ts
│   │   └── todosStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── chatAgent.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── README.md
```

## Features in Detail

### Data Persistence
All data is stored locally in your browser using localStorage. This means:
- No account required
- Your data stays on your device
- Works offline
- Data persists across sessions

### AI Assistant Intelligence
The AI assistant uses pattern matching to understand your intent and can:
- Parse natural language commands
- Create and manage your productivity data
- Search through your notes and tasks
- Provide summaries and analytics
- Offer contextual suggestions

## Future Enhancements

Potential features for future development:
- Cloud sync and backup
- Real AI integration (OpenAI/Anthropic APIs)
- Collaboration features
- Mobile responsive design improvements
- Export/import functionality
- Tags and categories
- Recurring tasks and events
- Attachments and file uploads
- Dark mode
- Keyboard shortcuts

## No Authentication Required

Currently, KiwiiLove runs entirely in your browser with no authentication. All data is stored locally. Future versions may include optional cloud sync with authentication.

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Made with 💚 by KiwiiLove
