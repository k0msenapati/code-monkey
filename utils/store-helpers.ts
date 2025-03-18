import { User } from "@/contexts/auth-context";

/**
 * Creates a unique storage key for a user-specific store
 */
export const getUserStoreKey = (baseKey: string, user: User | null): string => {
  if (!user) return baseKey;
  return `${baseKey}-${user.id}`;
};

/**
 * Custom storage adapter that namespaces data by user ID
 */
export const createUserScopedStorage = (user: User | null) => ({
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    return JSON.parse(str, (key, value) => {
      // Parse dates properly
      if (key === 'created' || key === 'createdAt' || key === 'updatedAt' || 
          key === 'date' || key === 'lastPlayed') {
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
});