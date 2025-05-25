import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChat } from '../providers/ChatProvider';
import { formatRelativeTime } from '@repo/shared';

// Type assertion for lucide icons to work with React 19
const SendIcon = Send as React.ComponentType<{ className?: string }>;
const Loader2Icon = Loader2 as React.ComponentType<{ className?: string }>;

export const ChatInterface = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <h3 className="text-lg font-medium mb-2">Welcome to AI Todo Assistant!</h3>
            <p>Ask me to create, update, or manage your tasks. Try saying:</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="bg-gray-100 rounded-lg p-3 mx-8">
                "Create a task: Buy groceries with high priority"
              </div>
              <div className="bg-gray-100 rounded-lg p-3 mx-8">
                "Show me all my high priority tasks"
              </div>
              <div className="bg-gray-100 rounded-lg p-3 mx-8">
                "Mark the grocery task as completed"
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.isStreaming && (
                  <div className="flex items-center mt-1">
                    <Loader2Icon className="w-3 h-3 animate-spin" />
                    <span className="text-xs ml-1 opacity-70">Thinking...</span>
                  </div>
                )}
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatRelativeTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to manage your tasks..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
