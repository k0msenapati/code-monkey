import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  initialized: boolean;
  
  createSession: (autoActivate?: boolean) => string;
  setActiveSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (id: string, message: ChatMessage) => void;
  setIsLoading: (isLoading: boolean) => void;
  initializeStore: () => void;
}

const DEFAULT_TITLE = "New conversation";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      isLoading: false,
      initialized: false,
      
      initializeStore: () => {
        const { initialized, sessions } = get();
        
        if (!initialized) {
          if (sessions.length === 0) {
            const id = get().createSession(false);
            set({ activeSessionId: id, initialized: true });
          } else {
            set({ initialized: true });
          }
        }
      },
      
      createSession: (autoActivate = true) => {
        const id = `chat_${Date.now()}`;
        const newSession: ChatSession = {
          id,
          title: DEFAULT_TITLE,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: autoActivate ? id : state.activeSessionId,
        }));
        
        return id;
      },
      
      setActiveSession: (id) => {
        set({ activeSessionId: id });
      },
      
      renameSession: (id, title) => {
        set((state) => ({
          sessions: state.sessions.map((session) => 
            session.id === id ? { ...session, title, updatedAt: new Date() } : session
          ),
        }));
      },
      
      deleteSession: (id) => {
        set((state) => {
          const newSessions = state.sessions.filter((session) => session.id !== id);
          const newActiveId = 
            state.activeSessionId === id 
              ? (newSessions[0]?.id || null) 
              : state.activeSessionId;
              
          return {
            sessions: newSessions,
            activeSessionId: newActiveId,
          };
        });
      },
      
      addMessage: (id, message) => {
        set((state) => {
          let sessionsToUpdate = state.sessions.map((session) => {
            if (session.id === id) {
              const newMessages = [...session.messages, message];
              let title = session.title;
              
              if (session.title === DEFAULT_TITLE && message.role === 'user' && newMessages.filter(m => m.role === 'user').length === 1) {
                title = message.content.length > 30 
                  ? `${message.content.substring(0, 30)}...` 
                  : message.content;
              }
              
              return {
                ...session,
                title,
                messages: newMessages,
                updatedAt: new Date(),
              };
            }
            return session;
          });
          
          return {
            sessions: sessionsToUpdate,
          };
        });
      },
      
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'chat-storage',
    }
  )
);