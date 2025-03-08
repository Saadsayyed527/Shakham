"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Edit, MoreHorizontal, Plus, Trash, Upload, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface VideoItem {
  id: string
  title: string
  description: string
  courseId: string
  courseName: string
  duration: string
  createdAt: string
  url: string
}

export function VideoManagement() {
  const { toast } = useToast()
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    courseId: "",
    file: null as File | null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchVideosAndCourses = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        // Fetch videos
        const videosResponse = await fetch("/api/instructor/videos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!videosResponse.ok) {
          throw new Error("Failed to fetch videos")
        }

        const videosData = await videosResponse.json()
        setVideos(videosData)

        // Fetch courses for dropdown
        const coursesResponse = await fetch("/api/instructor/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses")
        }

        const coursesData = await coursesResponse.json()
        setCourses(coursesData.map((course) => ({ id: course.id, title: course.title })))
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
        // Set some sample data for preview
        setVideos([
          {
            id: "1",
            title: "Introduction to React Hooks",
            description: "Learn the basics of React Hooks and how to use them in your applications.",
            courseId: "1",
            courseName: "Introduction to React",
            duration: "12:34",
            createdAt: "2023-10-15",
            url: "https://example.com/video1.mp4",
          },
          {
            id: "2",
            title: "State Management with Redux",
            description: "A comprehensive guide to managing state with Redux in React applications.",
            courseId: "1",
            courseName: "Introduction to React",
            duration: "24:18",
            createdAt: "2023-10-18",
            url: "https://example.com/video2.mp4",
          },
          {
            id: "3",
            title: "Advanced JavaScript Concepts",
            description: "Deep dive into advanced JavaScript concepts like closures and prototypes.",
            courseId: "2",
            courseName: "Advanced JavaScript Patterns",
            duration: "18:45",
            createdAt: "2023-11-05",
            url: "https://example.com/video3.mp4",
          },
        ])

        setCourses([
          { id: "1", title: "Introduction to React" },
          { id: "2", title: "Advanced JavaScript Patterns" },
          { id: "3", title: "MongoDB for Beginners" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVideosAndCourses()
  }, [toast])

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newVideo.title || !newVideo.courseId || !newVideo.file) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select a video file.",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("title", newVideo.title)
      formData.append("description", newVideo.description)
      formData.append("courseId", newVideo.courseId)
      formData.append("video", newVideo.file)

      const response = await fetch("/api/instructor/videos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to add video")
      }

      const newVideoData = await response.json()

      setVideos([...videos, newVideoData])
      setIsAddDialogOpen(false)
      setNewVideo({
        title: "",
        description: "",
        courseId: "",
        file: null,
      })

      toast({
        title: "Success",
        description: "Video added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add video. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedVideo || !selectedVideo.title || !selectedVideo.courseId) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/instructor/videos/${selectedVideo.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedVideo.title,
          description: selectedVideo.description,
          courseId: selectedVideo.courseId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update video")
      }

      const updatedVideoData = await response.json()

      setVideos(videos.map((video) => (video.id === selectedVideo.id ? updatedVideoData : video)))

      setIsEditDialogOpen(false)
      setSelectedVideo(null)

      toast({
        title: "Success",
        description: "Video updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update video. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/instructor/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete video")
      }

      setVideos(videos.filter((video) => video.id !== videoId))

      toast({
        title: "Success",
        description: "Video deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.courseName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Video Management</CardTitle>
          <CardDescription>Add, edit, and manage your course videos</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleAddVideo}>
              <DialogHeader>
                <DialogTitle>Add New Video</DialogTitle>
                <DialogDescription>Upload a new video to your course. Videos must be in MP4 format.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="Enter video description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={newVideo.courseId}
                    onValueChange={(value) => setNewVideo({ ...newVideo, courseId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="video">Video File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="video"
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="video/mp4,video/x-m4v,video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewVideo({ ...newVideo, file: e.target.files[0] })
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {newVideo.file ? newVideo.file.name : "Select video file"}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload Video</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search videos..."
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
                  <TableHead className="hidden md:table-cell">Course</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="hidden md:table-cell">Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No videos found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{video.courseName}</TableCell>
                      <TableCell className="hidden md:table-cell">{video.duration}</TableCell>
                      <TableCell className="hidden md:table-cell">{video.createdAt}</TableCell>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedVideo(video)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit Video
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Video className="mr-2 h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete Video
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

      {/* Edit Video Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedVideo && (
            <form onSubmit={handleUpdateVideo}>
              <DialogHeader>
                <DialogTitle>Edit Video</DialogTitle>
                <DialogDescription>Update the details of your video.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedVideo.title}
                    onChange={(e) => setSelectedVideo({ ...selectedVideo, title: e.target.value })}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedVideo.description}
                    onChange={(e) => setSelectedVideo({ ...selectedVideo, description: e.target.value })}
                    placeholder="Enter video description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-course">Course</Label>
                  <Select
                    value={selectedVideo.courseId}
                    onValueChange={(value) => setSelectedVideo({ ...selectedVideo, courseId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

