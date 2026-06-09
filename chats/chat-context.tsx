'use client'

import { createContext, useContext, type ReactNode } from 'react'

export type Language = 'en' | 'si'

export interface ChatContextValue {
  sendMessage: (text: string) => void
  language: Language
}

export const ChatContext = createContext<ChatContextValue>({
  sendMessage: () => {},
  language: 'en',
})

export function useChatContext(): ChatContextValue {
  return useContext(ChatContext)
}

interface ChatContextProviderProps {
  children: ReactNode
  sendMessage: (text: string) => void
  language: Language
}

export function ChatContextProvider({
  children,
  sendMessage,
  language,
}: ChatContextProviderProps) {
  return (
    <ChatContext.Provider value={{ sendMessage, language }}>
      {children}
    </ChatContext.Provider>
  )
}
