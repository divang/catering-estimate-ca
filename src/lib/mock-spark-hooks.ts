import { useState, useCallback } from 'react'

// Type declarations for the Spark global object
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: string[], ...values: any[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
      user: () => Promise<UserInfo>
      kv: {
        keys: () => Promise<string[]>
        get: (key: string) => Promise<string | null>
        set: (key: string, value: string) => Promise<void>
        delete: (key: string) => Promise<void>
      }
    }
  }
}

interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

// Initialize mock spark object if it doesn't exist
if (typeof window !== 'undefined' && !window.spark) {
  window.spark = {
    llmPrompt: (strings: string[], ...values: any[]) => {
      // Simple template literal implementation
      let result = strings[0]
      for (let i = 1; i < strings.length; i++) {
        result += String(values[i - 1]) + strings[i]
      }
      return result
    },
    
    llm: async (prompt: string, modelName?: string, jsonMode?: boolean) => {
      console.warn('LLM functionality not available in production build')
      if (jsonMode) {
        return JSON.stringify({ error: 'LLM not available in production' })
      }
      return 'LLM functionality not available in production build'
    },
    
    user: async () => {
      return {
        avatarUrl: '',
        email: 'demo@example.com',
        id: 'demo-user',
        isOwner: false,
        login: 'demo-user'
      }
    },
    
    kv: {
      keys: async () => {
        const keys = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith('spice-e-zaika-')) {
            keys.push(key.slice('spice-e-zaika-'.length))
          }
        }
        return keys
      },
      
      get: async (key: string) => {
        try {
          return localStorage.getItem(`spice-e-zaika-${key}`)
        } catch (error) {
          console.warn('Error getting value from localStorage:', error)
          return null
        }
      },
      
      set: async (key: string, value: string) => {
        try {
          localStorage.setItem(`spice-e-zaika-${key}`, value)
        } catch (error) {
          console.warn('Error setting value in localStorage:', error)
        }
      },
      
      delete: async (key: string) => {
        try {
          localStorage.removeItem(`spice-e-zaika-${key}`)
        } catch (error) {
          console.warn('Error deleting value from localStorage:', error)
        }
      }
    }
  }
}

// Mock useKV hook that uses localStorage as backing store
export function useKV<T = string>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Use localStorage as the storage mechanism
  const getStoredValue = useCallback(() => {
    try {
      const item = localStorage.getItem(`spice-e-zaika-${key}`)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('Error reading from localStorage, using default value:', error)
      return defaultValue
    }
  }, [key, defaultValue])

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value)
      localStorage.setItem(`spice-e-zaika-${key}`, JSON.stringify(value))
    } catch (error) {
      console.warn('Error saving to localStorage:', error)
    }
  }, [key])

  return [storedValue, setValue]
}

































