import { Sidebar } from './Sidebar';
import { useAppStore } from '../../stores/appStore';
import { NotesView } from '../Notes/NotesView';
import { TodosView } from '../Todo/TodosView';
import { CalendarView } from '../Calendar/CalendarView';
import { ChatView } from '../Chat/ChatView';

export function MainLayout() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'notes':
        return <NotesView />;
      case 'todos':
        return <TodosView />;
      case 'calendar':
        return <CalendarView />;
      case 'chat':
        return <ChatView />;
      default:
        return <NotesView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}
