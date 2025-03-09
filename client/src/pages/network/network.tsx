"use client"

import { useState, useEffect } from "react"
import { Search, X, UserPlus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";
import NetworkNavbar from "@/components/network-navbar"

interface User {
  id: string
  name: string
  role: string
  avatar?: string
  interests: string[]
  mutualConnections?: {
    count: number
    users?: {
      id: string
      name: string
    }[]
  }
  connectionStatus: "none" | "pending" | "connected"
}

export default function NetworkPage() {
  const { toast } = useToast()
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock interests for filtering
  const allInterests = [
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Mobile Development",
    "Blockchain",
    "Machine Learning",
    "Cloud Computing",
  ]

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: "1",
            name: "Sakshi Gabhale",
            role: "Frontend Developer | UI/UX Designer | Visual Designer",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["UI/UX Design", "Web Development"],
            mutualConnections: {
              count: 1,
              users: [{ id: "8", name: "Dhananjay" }],
            },
            connectionStatus: "none",
          },
          {
            id: "2",
            name: "Ajay Pathade",
            role: "Entrepreneur | Co-Founder at NirmanTech",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["Blockchain", "Cloud Computing"],
            connectionStatus: "none",
            mutualConnections: {
                count: 1,
                users: [{ id: "9", name: "Krish" }],
              },
          },
          {
            id: "3",
            name: "Tushar Hasule",
            role: "Full-Stack Web Developer",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["Web Development", "Cloud Computing"],
            mutualConnections: {
              count: 1,
              users: [{ id: "9", name: "Krish" }],
            },
            connectionStatus: "none",
          },
          {
            id: "4",
            name: "Amaan Ansari",
            role: "Software Developer @ DeepKlarity",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["Machine Learning", "Data Science"],
            mutualConnections: {
              count: 1,
              users: [{ id: "9", name: "Krish" }],
            },
            connectionStatus: "none",
          },
          {
            id: "5",
            name: "Sandeep Prajapati",
            role: "Blockchain and Crypto Enthusiast. Open for new opportunities",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["Blockchain", "Web Development"],
            mutualConnections: {
              count: 1,
              users: [{ id: "9", name: "Krish" }],
            },
            connectionStatus: "none",
          },
          {
            id: "6",
            name: "Vaishnavi Badhe",
            role: "UI UX Designer | Business Understanding | Product Design",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["UI/UX Design"],
            mutualConnections: {
              count: 3,
              users: [
                { id: "8", name: "Dhananjay" },
                { id: "10", name: "Rahul" },
              ],
            },
            connectionStatus: "none",
          },
          {
            id: "7",
            name: "Ravi Parmar",
            role: "Attended Sk Somaiya college",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["Mobile Development", "Web Development"],
            mutualConnections: {
              count: 1,
              users: [{ id: "9", name: "Krish" }],
            },
            connectionStatus: "none",
          },
          {
            id: "8",
            name: "Naman Jain",
            role: "Sub-Head @Innovation, NMIMS | M.Sc Data Science",
            avatar: "/placeholder.svg?height=200&width=200",
            interests: ["Data Science", "Machine Learning"],
            mutualConnections: {
              count: 2,
              users: [
                { id: "9", name: "Krish" },
                { id: "11", name: "Priya" },
              ],
            },
            connectionStatus: "none",
          },
        ]
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setIsLoading(false)
      }, 1000)
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search query and selected interests
    const filtered = users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesInterests =
        selectedInterests.length === 0 || user.interests.some((interest) => selectedInterests.includes(interest))

      return matchesSearch && matchesInterests
    })

    setFilteredUsers(filtered)
  }, [searchQuery, selectedInterests, users])

  const handleConnect = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, connectionStatus: "pending" } : user)))

    setFilteredUsers(
      filteredUsers.map((user) => (user.id === userId ? { ...user, connectionStatus: "pending" } : user)),
    )

    toast({
      title: "Connection request sent",
      description: "They'll be notified of your request.",
    })
  }

  const handleDismiss = (userId: string) => {
    setFilteredUsers(filteredUsers.filter((user) => user.id !== userId))
  }

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleChatWithUser = (userId: string) => {
    router.push(`/network/chat/${userId}`)
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Network</h1>
              <p className="text-muted-foreground">Connect with other learners who share your interests</p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or role"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {allInterests.map((interest) => (
                    <DropdownMenuCheckboxItem
                      key={interest}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="suggestions">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="connections">My Connections</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                  // Loading skeleton
                  Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="h-24 bg-muted animate-pulse" />
                          <div className="p-4 space-y-4">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                              <div className="space-y-2">
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                              </div>
                            </div>
                            <div className="h-8 bg-muted animate-pulse rounded" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : filteredUsers.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-6">
                      <UserPlus className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">No users found</h2>
                    <p className="mt-2 text-muted-foreground max-w-sm">
                      {searchQuery || selectedInterests.length > 0
                        ? "Try adjusting your search or filters to find more people."
                        : "We couldn't find any users to suggest right now. Check back later!"}
                    </p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm z-10"
                        onClick={() => handleDismiss(user.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10" />
                      <CardContent className="p-4 pt-0 -mt-12">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="mt-2 font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 h-10">{user.role}</p>

                          <div className="mt-2 flex flex-wrap gap-1 justify-center">
                            {user.interests.map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>

                          {user.mutualConnections && (
                            <div className="mt-3 text-xs text-muted-foreground flex items-center">
                              <div className="flex -space-x-2 mr-2">
                                {user.mutualConnections.users?.map((mutualUser) => (
                                  <Avatar key={mutualUser.id} className="h-5 w-5 border border-background">
                                    <AvatarFallback className="text-[8px]">{mutualUser.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              {user.mutualConnections.count === 1 ? (
                                <span>{user.mutualConnections.users?.[0].name} is a mutual connection</span>
                              ) : (
                                <span>
                                  {user.mutualConnections.users?.[0].name} and {user.mutualConnections.count - 1} other
                                  mutual {user.mutualConnections.count - 1 === 1 ? "connection" : "connections"}
                                </span>
                              )}
                            </div>
                          )}

                          <Button
                            className="mt-4 w-full"
                            variant={user.connectionStatus === "pending" ? "outline" : "default"}
                            disabled={user.connectionStatus === "pending"}
                            onClick={() => handleConnect(user.id)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {user.connectionStatus === "pending" ? "Request Sent" : "Connect"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <UserPlus className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">No pending requests</h2>
                <p className="mt-2 text-muted-foreground max-w-sm">
                  When you send or receive connection requests, they'll appear here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="connections" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <UserPlus className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">No connections yet</h2>
                <p className="mt-2 text-muted-foreground max-w-sm">
                  Start connecting with other learners to build your network.
                </p>
                <Button className="mt-4" onClick={() => document.querySelector('[value="suggestions"]')?.click()}>
                  Find People
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

