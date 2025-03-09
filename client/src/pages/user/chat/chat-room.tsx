"use client"

import { useState, useEffect } from "react"
import { Send, Smile, Paperclip, MoreVertical, Search, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

interface ChatUser {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen?: Date
}

interface ChatRoomProps {
  chatId: string
}

// Simulated chat data
const chatData: Record<string, {
  user: ChatUser
  messages: Message[]
}> = {
  "1": {
    user: {
      id: "2",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
      status: "online",
      lastSeen: new Date(),
    },
    messages: [
      {
        id: "1",
        content: "Hey! How are you?",
        sender: {
          id: "2",
          name: "John Doe",
          avatar: "https://github.com/shadcn.png",
        },
        timestamp: new Date(Date.now() - 3600000),
        status: "read",
      },
      {
        id: "2",
        content: "I'm good, thanks! How about you?",
        sender: {
          id: "1",
          name: "Current User",
          avatar: "https://github.com/shadcn.png",
        },
        timestamp: new Date(Date.now() - 3500000),
        status: "read",
      },
    ],
  },
  "2": {
    user: {
      id: "3",
      name: "Jane Smith",
      avatar: "https://github.com/shadcn.png",
      status: "offline",
      lastSeen: new Date(Date.now() - 1800000),
    },
    messages: [
      {
        id: "1",
        content: "The project looks great! Let's discuss the next steps.",
        sender: {
          id: "3",
          name: "Jane Smith",
          avatar: "https://github.com/shadcn.png",
        },
        timestamp: new Date(Date.now() - 7200000),
        status: "read",
      },
    ],
  },
}

function ChatHeader({ user }: { user: ChatUser }) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">
            {user.status === "online" ? (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Online
              </span>
            ) : (
              `Last seen ${user.lastSeen?.toLocaleString()}`
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem>Block User</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Report User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
        {!isOwn && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback>{message.sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            {isOwn && (
              <span>
                {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatInput({ onSend }: { onSend: (content: string) => void }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}

export default function ChatRoom({ chatId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatUser, setChatUser] = useState<ChatUser | null>(null)

  useEffect(() => {
    // Simulate fetching chat data
    const chat = chatData[chatId]
    if (chat) {
      setMessages(chat.messages)
      setChatUser(chat.user)
    }
  }, [chatId])

  const currentUser = {
    id: "1",
    name: "Current User",
    avatar: "https://github.com/shadcn.png",
  }

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      timestamp: new Date(),
      status: "sent",
    }
    setMessages([...messages, newMessage])
  }

  if (!chatUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader user={chatUser} />
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender.id === currentUser.id}
          />
        ))}
      </ScrollArea>
      <ChatInput onSend={handleSendMessage} />
    </div>
  )
}
