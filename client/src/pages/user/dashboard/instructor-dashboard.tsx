"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell,
  ChevronDown,
  Laptop,
  LogOut,
  Plus,
  Settings,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CourseManagement } from "./course-management"
import { VideoManagement } from "./video-management"
import { ProfileSettings } from "./profile-settings"
import { InstructorStats } from "./instructor-stats"

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [instructorData, setInstructorData] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    // const fetchInstructorData = async () => {
    //   try {
    //     setLoading(true)
    //     const response = await fetch("/api/instructor/profile", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch instructor data")
    //     }

    //     const data = await response.json()
    //     setInstructorData(data)
    //   } catch (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to load instructor data. Please try again.",
    //       variant: "destructive",
    //     })
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    // fetchInstructorData()
  }, [navigate, toast])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="hidden md:flex md:w-64">
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <Laptop className="h-6 w-6" />
              <span className="text-lg font-bold">Evolve LMS</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Plus className="h-4 w-4" />
                  <span>Create Course</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Instructor Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {instructorData?.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden md:inline-flex">
                      {instructorData?.name || "Instructor"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Tabs Section */}
          <main className="flex-1 overflow-auto px-4 py-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4 grid grid-cols-4 max-w-[600px] mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <div className="max-w-full">
                <TabsContent value="overview">
                  <InstructorStats />
                </TabsContent>
                <TabsContent value="courses">
                  <CourseManagement />
                </TabsContent>
                <TabsContent value="videos">
                  <VideoManagement />
                </TabsContent>
                <TabsContent value="profile">
                  <ProfileSettings
                    instructorData={instructorData}
                    setInstructorData={setInstructorData}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
