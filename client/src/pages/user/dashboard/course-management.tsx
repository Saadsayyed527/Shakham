"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface Course {
  id: string
  title: string
  category: string
  price: number
  students: number
  status: "published" | "draft"
  createdAt: string
}

export function CourseManagement() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("/api/instructor/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        })
        // Set some sample data for preview
        setCourses([
          {
            id: "1",
            title: "Introduction to React",
            category: "Web Development",
            price: 1999,
            students: 45,
            status: "published",
            createdAt: "2023-09-15",
          },
          {
            id: "2",
            title: "Advanced JavaScript Patterns",
            category: "Programming",
            price: 2499,
            students: 32,
            status: "published",
            createdAt: "2023-10-02",
          },
          {
            id: "3",
            title: "MongoDB for Beginners",
            category: "Database",
            price: 1499,
            students: 18,
            status: "draft",
            createdAt: "2023-11-10",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/instructor/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete course")
      }

      setCourses(courses.filter((course) => course.id !== courseId))
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>Manage your courses and their content</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Students</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No courses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{course.category}</TableCell>
                      <TableCell>₹{course.price}</TableCell>
                      <TableCell className="hidden md:table-cell">{course.students}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            course.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          }`}
                        >
                          {course.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Video className="mr-2 h-4 w-4" /> Manage Videos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Missing import for Video component
function Video(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}

