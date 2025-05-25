import { useState, useEffect } from 'react';
import { ChatProvider } from './providers/ChatProvider';
import { ChatInterface } from './components/ChatInterface';
import { TaskList } from './components/TaskList';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Test connection to MCP server
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/mcp/tools');
        setIsConnected(response.ok);
      } catch (error) {
        console.error('Failed to connect to MCP server:', error);
        setIsConnected(false);
      }
    };

    testConnection();
    const interval = setInterval(testConnection, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <ChatProvider>
      <div className="h-screen flex bg-gray-50">
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">AI Todo Assistant</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </header>

          <div className="flex-1 flex">
            <div className="flex-1">
              <ChatInterface />
            </div>
            <div className="w-80 border-l border-gray-200">
              <TaskList />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default App;
