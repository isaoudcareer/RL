import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useNotesStore } from '../../stores/notesStore';
import { useTodosStore } from '../../stores/todosStore';
import { useCalendarStore } from '../../stores/calendarStore';
import { analyzeUserIntent } from '../../utils/chatAgent';
import { format } from 'date-fns';

export function ChatView() {
  const { messages, addMessage, clearMessages } = useChatStore();
  const { notes, addNote } = useNotesStore();
  const { todos, addTodo } = useTodosStore();
  const { events, addEvent } = useCalendarStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage({
      role: 'user',
      content: input,
    });

    // Analyze intent and get response
    const context = { notes, todos, events };
    const { response, action } = analyzeUserIntent(input, context);

    // Execute action
    if (action.type === 'create_note') {
      addNote({
        title: action.data.title,
        content: '',
      });
    } else if (action.type === 'create_todo') {
      addTodo({
        title: action.data.title,
        completed: false,
        priority: action.data.priority,
      });
    } else if (action.type === 'create_event') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      const endTime = new Date(tomorrow);
      endTime.setHours(10, 0, 0, 0);

      addEvent({
        title: action.data.title,
        start: tomorrow,
        end: endTime,
      });
    }

    // Add assistant response
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: response,
      });
    }, 500);

    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your intelligent productivity companion
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center mt-12">
              <Bot className="w-16 h-16 mx-auto text-kiwii-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to KiwiiLove AI Assistant!
              </h3>
              <p className="text-gray-500 mb-6">
                I can help you manage your notes, tasks, and calendar. Try asking me
                something!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
                {[
                  'Create a note called "Project Ideas"',
                  'Add a high priority task to finish the report',
                  'Show my todos',
                  'Give me a summary',
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(example)}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-kiwii-500 hover:bg-kiwii-50 transition-colors text-sm text-gray-700"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-kiwii-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-kiwii-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-kiwii-100' : 'text-gray-400'
                    }`}
                  >
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your notes, tasks, or calendar..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiwii-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-kiwii-500 text-white rounded-lg hover:bg-kiwii-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
