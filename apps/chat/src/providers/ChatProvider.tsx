import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type TaskDTO } from '@repo/mcp-types';
import { io, type Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  tasks: TaskDTO[];
  refreshTasks: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize WebSocket connection for real-time task updates
  useEffect(() => {
    // Use relative URL for WebSocket to work with reverse proxy
    const wsUrl = window.location.protocol === 'https:'
      ? `wss://${window.location.host}/tasks`
      : `ws://${window.location.host}/tasks`;

    const newSocket = io(wsUrl, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to tasks WebSocket');
      // Join user room for personalized updates (using hardcoded user for MCP)
      const userId = 'a339940f-0c17-4eeb-85e1-fe026d2bcc08';
      newSocket.emit('join-user-room', { userId });
    });

    newSocket.on('task-created', (task: TaskDTO) => {
      console.log('Task created:', task);
      setTasks(prev => [task, ...prev]);
    });

    newSocket.on('task-updated', (task: TaskDTO) => {
      console.log('Task updated:', task);
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    });

    newSocket.on('task-deleted', ({ id }: { id: string }) => {
      console.log('Task deleted:', id);
      setTasks(prev => prev.filter(t => t.id !== id));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Use Server-Sent Events for real-time streaming from Claude AI
      const response = await fetch('/api/mcp/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude AI');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: msg.content + (data.content || '') }
                      : msg
                  )
                );
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

      await refreshTasks();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: 'Sorry, I encountered an error processing your request.',
        role: 'assistant',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks/internal/mcp');

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  // Load initial tasks
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const value: ChatContextType = {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    tasks,
    refreshTasks,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
