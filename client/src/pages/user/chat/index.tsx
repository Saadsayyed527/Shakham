"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Navbar } from "@/components/navbar"
import ChatList from "./chat-list"
import ChatRoom from "./chat-room"

interface RootState {
  auth: {
    user: {
      role?: string
      userId?: string
    } | null
  }
}

export default function ChatPage() {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  // Redirect if not logged in
  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <ChatList 
          onSelectChat={setSelectedChatId} 
          selectedChatId={selectedChatId} 
        />
        {selectedChatId ? (
          <div className="flex-1">
            <ChatRoom chatId={selectedChatId} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
