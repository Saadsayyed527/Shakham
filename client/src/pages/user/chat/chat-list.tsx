"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ChatPreview {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  status: "online" | "offline" | "away"
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void
  selectedChatId: string | null
}

function ChatItem({ chat, isSelected, onClick }: { 
  chat: ChatPreview
  isSelected: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 flex items-center gap-3 hover:bg-accent rounded-lg transition-colors",
        isSelected && "bg-accent"
      )}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={chat.avatar} />
          <AvatarFallback>{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {chat.status === "online" && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <span className="font-medium">{chat.name}</span>
          <span className="text-xs text-muted-foreground">
            {chat.timestamp.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const chats: ChatPreview[] = [
    {
      id: "1",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Hey! How are you?",
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 2,
      status: "online"
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "The project looks great! Let's discuss the next steps.",
      timestamp: new Date(Date.now() - 7200000),
      unreadCount: 0,
      status: "offline"
    },
    {
      id: "3",
      name: "Alex Johnson",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Can we schedule a meeting for tomorrow?",
      timestamp: new Date(Date.now() - 86400000),
      unreadCount: 1,
      status: "away"
    },
    {
      id: "4",
      name: "Sarah Williams",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Thanks for your help!",
      timestamp: new Date(Date.now() - 172800000),
      unreadCount: 0,
      status: "offline"
    }
  ]

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-80 border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
