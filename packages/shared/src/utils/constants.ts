export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    CURRENT_USER: '/api/auth/current-user',
  },
  TASKS: {
    BASE: '/api/tasks',
    BY_ID: (id: string) => `/api/tasks/${id}`,
  },
  MCP: {
    TOOLS: '/api/mcp/tools',
    CALL_TOOL: '/api/mcp/tools/call',
    INTERPRET: '/api/mcp/interpret',
  },
} as const;

export const WEBSOCKET_EVENTS = {
  TASKS: {
    JOIN_USER_ROOM: 'join-user-room',
    TASK_CREATED: 'task-created',
    TASK_UPDATED: 'task-updated',
    TASK_DELETED: 'task-deleted',
  },
  MCP: {
    INTERPRET_MESSAGE: 'interpret-message',
    JOIN_ROOM: 'join-room',
    STREAM_CHUNK: 'stream-chunk',
    STREAM_END: 'stream-end',
  },
} as const;

export const PRIORITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION_RULES = {
  TASK_TITLE_MAX_LENGTH: 200,
  TASK_DESCRIPTION_MAX_LENGTH: 1000,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 200,
} as const;
