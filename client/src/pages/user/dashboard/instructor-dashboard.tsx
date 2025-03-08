"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { logout } from "@/slices/userSlice"

import {
  Bell, ChevronDown, Laptop, LogOut, Plus, Settings, User
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CourseManagement } from "./course-management"
import  VideoManagement  from "./video-management"
import { ProfileSettings } from "./profile-settings"
import { InstructorStats } from "./instructor-stats"

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      navigate("/login")
      toast({
        title: "Access Denied",
        description: "You must be an instructor to access this page.",
        variant: "destructive",
      })
    }
  }, [user, navigate, toast])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const sidebarItems = [
    { label: "Dashboard", icon: <User className="h-4 w-4" />, active: true },
    { label: "Create Course", icon: <Plus className="h-4 w-4" /> },
    { label: "Settings", icon: <Settings className="h-4 w-4" /> }
  ]

  const tabs = [
    { value: "overview", label: "Overview", content: <InstructorStats /> },
    { value: "courses", label: "Courses", content: <CourseManagement /> },
    { value: "videos", label: "Videos", content: <VideoManagement /> },
    { value: "profile", label: "Profile", content: <ProfileSettings instructorData={user} /> }
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar className="hidden md:flex md:w-64">
          <SidebarHeader className="flex items-center px-4 py-2">
            <Laptop className="h-6 w-6" />
            <span className="text-lg font-bold">Evolve LMS</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton isActive={item.active}>
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
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
            <h1 className="text-lg font-semibold flex-1">Instructor Dashboard</h1>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="hidden md:inline-flex">{user?.name || "Instructor"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Tabs Section */}
          <main className="flex-1 overflow-auto px-4 py-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4 grid grid-cols-4 max-w-[600px] mx-auto">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="max-w-full">
                {tabs.map(tab => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
