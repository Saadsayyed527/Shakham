"use client"

import { BarChart, DollarSign, Users, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function InstructorStats() {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalVideos: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       setLoading(true)
  //       const token = localStorage.getItem("token")
  //       const response = await fetch("/api/instructor/stats", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch stats")
  //       }

  //       const data = await response.json()
  //       setStats(data)
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to load statistics. Please try again.",
  //         variant: "destructive",
  //       })
  //       // Set some default data for preview
  //       setStats({
  //         totalStudents: 128,
  //         totalCourses: 12,
  //         totalVideos: 86,
  //         totalRevenue: 4280,
  //       })
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchStats()
  // }, [toast])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading data...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <p className="text-xs text-muted-foreground">+2 new this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
          <Video className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVideos}</div>
          <p className="text-xs text-muted-foreground">+8 new this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+18% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}

