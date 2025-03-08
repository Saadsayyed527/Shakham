"use client"

import { LayoutDashboard, BookOpen, GraduationCap, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SidebarNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
  const navItems = [
    {
      title: "Dashboard",
      value: "dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Assignments",
      value: "assignments",
      icon: BookOpen,
    },
    {
      title: "Grades & Feedback",
      value: "grades",
      icon: GraduationCap,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Student Portal</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveTab(item.value)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 mt-auto">
        <Separator className="my-2" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

