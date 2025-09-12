import { useState, useCallback } from 'react'

// Mock implementation of useKV for production builds
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((current: T) => T)) => void, () => void] {
  // Use localStorage as the storage mechanism
  const getStoredValue = useCallback(() => {
    try {
      const item = localStorage.getItem(`spice-e-zaika-${key}`)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to parse stored value for key "${key}":`, error)
      return defaultValue
    }
  }, [key, defaultValue])

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  const setValue = useCallback((value: T | ((current: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(`spice-e-zaika-${key}`, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Failed to store value for key "${key}":`, error)
    }
  }, [key, storedValue])

  const deleteValue = useCallback(() => {
    try {
      localStorage.removeItem(`spice-e-zaika-${key}`)
      setStoredValue(defaultValue)
    } catch (error) {
      console.error(`Failed to delete value for key "${key}":`, error)
    }
  }, [key, defaultValue])

  return [storedValue, setValue, deleteValue]
}

// Mock spark global object for production
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: string[], ...values: any[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
      user: () => Promise<UserInfo>
      kv: {
        keys: () => Promise<string[]>
        get: <T>(key: string) => Promise<T | undefined>
        set: <T>(key: string, value: T) => Promise<void>
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
            keys.push(key.replace('spice-e-zaika-', ''))
          }
        }
        return keys
      },
      
      get: async <T>(key: string): Promise<T | undefined> => {
        try {
          const item = localStorage.getItem(`spice-e-zaika-${key}`)
          return item ? JSON.parse(item) : undefined
        } catch (error) {
          console.error(`Failed to get value for key "${key}":`, error)
          return undefined
        }
      },
      
      set: async <T>(key: string, value: T): Promise<void> => {
        try {
          localStorage.setItem(`spice-e-zaika-${key}`, JSON.stringify(value))
        } catch (error) {
          console.error(`Failed to set value for key "${key}":`, error)
        }
      },
      
      delete: async (key: string): Promise<void> => {
        try {
          localStorage.removeItem(`spice-e-zaika-${key}`)
        } catch (error) {
          console.error(`Failed to delete value for key "${key}":`, error)
        }
      }
    }
  }
}