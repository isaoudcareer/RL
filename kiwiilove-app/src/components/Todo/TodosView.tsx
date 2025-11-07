import { useState } from 'react';
import { Plus, Trash2, Check, Circle } from 'lucide-react';
import { useTodosStore } from '../../stores/todosStore';
import { format } from 'date-fns';

export function TodosView() {
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodosStore();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodo({
        title: newTodoTitle.trim(),
        completed: false,
        priority,
      });
      setNewTodoTitle('');
      setPriority('medium');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">To-Do List</h2>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiwii-500"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiwii-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-kiwii-500 text-white rounded-lg hover:bg-kiwii-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === filterOption
                  ? 'bg-kiwii-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-auto p-6">
        {sortedTodos.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {filter === 'all' && 'No tasks yet. Add one above!'}
            {filter === 'active' && 'No active tasks!'}
            {filter === 'completed' && 'No completed tasks yet!'}
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl mx-auto">
            {sortedTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg border-2 p-4 transition-all ${
                  todo.completed ? 'border-gray-200 opacity-60' : 'border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-kiwii-500 border-kiwii-500'
                        : 'border-gray-300 hover:border-kiwii-500'
                    }`}
                  >
                    {todo.completed ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-3 h-3 text-transparent" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-gray-900 ${
                          todo.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {todo.title}
                      </p>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>
                      {todo.dueDate && (
                        <span className="text-xs text-gray-500">
                          Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Created: {format(new Date(todo.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
