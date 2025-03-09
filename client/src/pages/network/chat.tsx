"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate  } from "react-router-dom"

import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, ImageIcon, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import NetworkNavbar from "@/components/network-navbar"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Message {
  id: string
  text: string
  timestamp: Date
  isFromMe: boolean
  status: "sending" | "sent" | "delivered" | "read"
}

interface Connection {
  id: string
  name: string
  avatar?: string
  role: string
  isOnline: boolean
  lastActive?: Date
}

export default function ChatDetail() {
  const params = useParams()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const connectionId = params.id as string
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate API call to fetch connection details and messages
    const fetchData = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock connection data
        const mockConnection: Connection = {
          id: connectionId,
          name:
            connectionId === "1"
              ? "Sakshi Gabhale"
              : connectionId === "2"
                ? "Ajay Pathade"
                : connectionId === "3"
                  ? "Tushar Hasule"
                  : "Amaan Ansari",
          avatar: "/placeholder.svg?height=200&width=200",
          role:
            connectionId === "1"
              ? "Frontend Developer | UI/UX Designer"
              : connectionId === "2"
                ? "Entrepreneur | Co-Founder at NirmanTech"
                : connectionId === "3"
                  ? "Full-Stack Web Developer"
                  : "Software Developer @ DeepKlarity",
          isOnline: connectionId === "1" || connectionId === "3",
          lastActive: connectionId === "2" || connectionId === "4" ? new Date(Date.now() - 1000 * 60 * 30) : undefined,
        }
        
        // Mock messages
        const mockMessages: Message[] = [
          {
            id: "1",
            text: "Hi there! How are you doing?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            isFromMe: false,
            status: "read",
          },
          {
            id: "2",
            text: "I'm doing well, thanks for asking! How about you?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
            isFromMe: true,
            status: "read",
          },
          {
            id: "3",
            text: "I've been working on that project we discussed last week.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
            isFromMe: true,
            status: "read",
          },
          {
            id: "4",
            text: "That sounds great! How's it coming along?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
            isFromMe: false,
            status: "read",
          },
          {
            id: "5",
            text: "I made some good progress. Would you like to see what I've done so far?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            isFromMe: true,
            status: "read",
          },
          {
            id: "6",
            text: "I'd love to take a look at it.",
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            isFromMe: false,
            status: "read",
          },
        ]

        setConnection(mockConnection)
        setMessages(mockMessages)
        setIsLoading(false)
      }, 1000)
    }

    if (connectionId) {
      fetchData()
    }
  }, [connectionId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Create a new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: message,
      timestamp: new Date(),
      isFromMe: true,
      status: "sending",
    }

    // Add to messages
    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate sending message and updating status
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)),
      )

      // Simulate delivery
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
        )

        // Simulate read receipt
        setTimeout(() => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)),
          )
        }, 2000)
      }, 1000)
    }, 500)

    // Simulate reply after a delay
    if (Math.random() > 0.5) {
      setTimeout(
        () => {
          const replyMessage: Message = {
            id: `msg-${Date.now()}`,
            text: getRandomReply(),
            timestamp: new Date(),
            isFromMe: false,
            status: "delivered",
          }
          setMessages((prevMessages) => [...prevMessages, replyMessage])
        },
        3000 + Math.random() * 2000,
      )
    }
  }

  const getRandomReply = () => {
    const replies = [
      "That's interesting!",
      "Thanks for sharing that.",
      "I see what you mean.",
      "Let me think about that.",
      "Do you have any more details?",
      "That's exactly what I was looking for!",
      "Great! When can we discuss this further?",
      "I appreciate your help with this.",
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }

  const handleStartVideoCall = () => {
    navigate(`/network/call/${connectionId}?type=video`)
    toast({
        title: "Starting video call",
        description: `Initiating video call with ${connection?.name}`,
      })
  }

  const handleStartAudioCall = () => {
    navigate(`/network/call/${connectionId}?type=audio`)
    toast({
      title: "Starting audio call",
      description: `Initiating audio call with ${connection?.name}`,
    })
  }

  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const isToday =
      date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()

    if (isToday) {
      return format(date, "h:mm a")
    } else {
      return format(date, "MMM d, h:mm a")
    }
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return "·"
      case "sent":
        return "✓"
      case "delivered":
        return "✓✓"
      case "read":
        return "✓✓"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile back button */}
        <div className="md:hidden absolute top-16 left-2 z-10">
          <Button variant="ghost" size="icon" onClick={() => navigate("/network/chat")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </div>

        {/* Chat sidebar - hidden on mobile */}
        <div className="hidden md:block w-80 border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          {/* This would be the chat list component, reused from the chat page */}
          <div className="p-8 text-center text-muted-foreground">
            <p>Chat list would appear here</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          {isLoading ? (
            <div className="border-b p-4">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          ) : connection ? (
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={connection.avatar} alt={connection.name} />
                    <AvatarFallback>
                      {connection.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{connection.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${connection.isOnline ? "bg-green-500" : "bg-muted"}`}
                      />
                      {connection.isOnline
                        ? "Online"
                        : connection.lastActive
                          ? `Last active ${format(connection.lastActive, "h:mm a")}`
                          : "Offline"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={handleStartAudioCall}>
                    <Phone className="h-4 w-4" />
                    <span className="sr-only">Audio Call</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleStartVideoCall}>
                    <Video className="h-4 w-4" />
                    <span className="sr-only">Video Call</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                      <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Block user</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ) : null}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              // Loading skeleton for messages
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-2 mb-4 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                  >
                    {i % 2 === 0 && <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />}
                    <div
                      className={`rounded-lg p-3 ${
                        i % 2 === 0 ? "bg-muted animate-pulse w-64 h-16" : "bg-primary/20 animate-pulse w-48 h-12"
                      }`}
                    />
                  </div>
                ))
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  // Check if we need to show date separator
                  const showDateSeparator =
                    index === 0 ||
                    new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString()

                  return (
                    <div key={msg.id}>
                      {showDateSeparator && (
                        <div className="flex justify-center my-4">
                          <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                            {format(msg.timestamp, "EEEE, MMMM d")}
                          </div>
                        </div>
                      )}
                      <div className={`flex items-start space-x-2 ${msg.isFromMe ? "justify-end" : "justify-start"}`}>
                        {!msg.isFromMe && connection && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={connection.avatar} alt={connection.name} />
                            <AvatarFallback>
                              {connection.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <div
                            className={`rounded-lg p-3 max-w-[75%] ${
                              msg.isFromMe ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                          <div
                            className={`flex items-center text-xs text-muted-foreground mt-1 ${
                              msg.isFromMe ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>{formatMessageTime(msg.timestamp)}</span>
                            {msg.isFromMe && (
                              <span className={`ml-1 ${msg.status === "read" ? "text-primary" : ""}`}>
                                {getStatusIcon(msg.status)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message input */}
          <div className="border-t p-4">
            <div className="flex items-end space-x-2">
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ImageIcon className="h-5 w-5" />
                  <span className="sr-only">Send image</span>
                </Button>
              </div>
              <Textarea
                placeholder="Type a message..."
                className="flex-1 min-h-[40px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Smile className="h-5 w-5" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

