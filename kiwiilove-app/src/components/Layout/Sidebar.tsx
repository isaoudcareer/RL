import { FileText, CheckSquare, Calendar, MessageSquare } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import type { AppView } from '../../types';

const navItems = [
  { id: 'notes' as AppView, label: 'Notes', icon: FileText },
  { id: 'todos' as AppView, label: 'To-Do', icon: CheckSquare },
  { id: 'calendar' as AppView, label: 'Calendar', icon: Calendar },
  { id: 'chat' as AppView, label: 'AI Chat', icon: MessageSquare },
];

export function Sidebar() {
  const { currentView, setView } = useAppStore();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-kiwii-600">KiwiiLove</h1>
        <p className="text-sm text-gray-500 mt-1">Your productivity companion</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-kiwii-100 text-kiwii-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Made with 💚 by KiwiiLove
        </div>
      </div>
    </aside>
  );
}
