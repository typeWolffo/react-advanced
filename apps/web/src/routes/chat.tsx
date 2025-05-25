import { lazy, Suspense } from 'react';

// @ts-expect-error - Module Federation remote
const ChatApp = lazy(() => import('chat/ChatApp'));

export default function ChatRoute() {
  return (
    <div className="h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI Chat...</p>
          </div>
        </div>
      }>
        <ChatApp />
      </Suspense>
    </div>
  );
}
