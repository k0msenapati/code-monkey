import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  resources: { title: string; url: string }[];
  completed: boolean;
}

export type Roadmap = {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: RoadmapStep[];
  progress: number;
  created: Date;
}

interface RoadmapState {
  roadmaps: Roadmap[];
  activeRoadmap: Roadmap | null;
  isGenerating: boolean;
  chatHistory: {
    roadmapId: string;
    messages: { role: 'user' | 'assistant'; content: string }[];
  }[];
  
  addRoadmap: (roadmap: Roadmap) => void;
  updateRoadmap: (roadmap: Roadmap) => void;
  removeRoadmap: (id: string) => void;
  setActiveRoadmap: (roadmap: Roadmap | null) => void;
  toggleStepCompletion: (roadmapId: string, stepId: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addChatMessage: (roadmapId: string, message: { role: 'user' | 'assistant'; content: string }) => void;
  reset: () => void;
}

const customStorage = {
  getItem: (name: string) => {
    const str = typeof window !== 'undefined' ? localStorage.getItem(name) : null;
    if (!str) return null;
    
    return JSON.parse(str, (key, value) => {
      if (key === 'created' || key === 'date') {
        return value ? new Date(value) : value;
      }
      return value;
    });
  },
  setItem: (name: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  }
};

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set, get) => ({
      roadmaps: [],
      activeRoadmap: null,
      isGenerating: false,
      chatHistory: [],
      
      addRoadmap: (roadmap) => set((state) => ({ 
        roadmaps: [roadmap, ...state.roadmaps] 
      })),
      
      updateRoadmap: (roadmap) => set((state) => ({
        roadmaps: state.roadmaps.map((r) => r.id === roadmap.id ? roadmap : r),
        activeRoadmap: state.activeRoadmap?.id === roadmap.id ? roadmap : state.activeRoadmap
      })),
      
      removeRoadmap: (id) => set((state) => ({
        roadmaps: state.roadmaps.filter((r) => r.id !== id),
        activeRoadmap: state.activeRoadmap?.id === id ? null : state.activeRoadmap
      })),
      
      setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),
      
      toggleStepCompletion: (roadmapId, stepId) => set((state) => {
        const updatedRoadmaps = state.roadmaps.map((roadmap) => {
          if (roadmap.id === roadmapId) {
            const updatedSteps = roadmap.steps.map((step) => {
              if (step.id === stepId) {
                return { ...step, completed: !step.completed };
              }
              return step;
            });
            
            const completedSteps = updatedSteps.filter(step => step.completed).length;
            const progress = Math.round((completedSteps / updatedSteps.length) * 100);
            
            return { ...roadmap, steps: updatedSteps, progress };
          }
          return roadmap;
        });
        
        const updatedActiveRoadmap = state.activeRoadmap && state.activeRoadmap.id === roadmapId
          ? updatedRoadmaps.find(r => r.id === roadmapId) || null
          : state.activeRoadmap;
          
        return {
          roadmaps: updatedRoadmaps,
          activeRoadmap: updatedActiveRoadmap
        };
      }),
      
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      
      addChatMessage: (roadmapId, message) => set((state) => {
        const existingChatIndex = state.chatHistory.findIndex(chat => chat.roadmapId === roadmapId);
        
        if (existingChatIndex >= 0) {
          const updatedChatHistory = [...state.chatHistory];
          updatedChatHistory[existingChatIndex] = {
            roadmapId,
            messages: [...updatedChatHistory[existingChatIndex].messages, message]
          };
          return { chatHistory: updatedChatHistory };
        } else {
          return { 
            chatHistory: [...state.chatHistory, {
              roadmapId,
              messages: [message]
            }]
          };
        }
      }),
      
      reset: () => set(() => ({
        roadmaps: [],
        activeRoadmap: null,
        isGenerating: false,
        chatHistory: []
      })),
    }),
    {
      name: 'roadmap-storage',
      storage: customStorage
    }
  )
);