"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Plus, Trash, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "react-router-dom"

interface VideoItem {
  id: string
  title: string
  description: string
  price: number
  category: string
  rating: number
  videos: string[]
}

export function VideoManagement() {
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId')
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    videoUrl: "",
  })

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(null), 3000)
  }

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3000)
  }

  useEffect(() => {
    const fetchVideos = async () => {
      if (!courseId) {
        showError("No course ID provided")
        return
      }

      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }

        const data = await response.json()
        setVideos(data)
      } catch (error) {
        showError("Failed to load videos. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [courseId])

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId) {
      showError("No course ID provided")
      return
    }

    if (!newVideo.title || !newVideo.description || !newVideo.videoUrl || !newVideo.category) {
      showError("Please fill all required fields.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}/videos`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newVideo.title,
          description: newVideo.description,
          price: Number(newVideo.price),
          category: newVideo.category,
          rating: Number(newVideo.rating),
          videoUrl: newVideo.videoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add video")
      }

      const newVideoData = await response.json()
      setVideos(prev => [...prev, newVideoData])
      setIsAddDialogOpen(false)
      setNewVideo({
        title: "",
        description: "",
        price: 0,
        category: "",
        rating: 0,
        videoUrl: "",
      })

      showSuccess("Video added successfully")
    } catch (error) {
      showError("Failed to add video. Please try again.")
    }
  }

  const handleEditVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVideo || !selectedVideo.id || !courseId) {
      showError("No video selected for editing")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}/videos/${selectedVideo.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedVideo.title,
          description: selectedVideo.description,
          price: Number(selectedVideo.price),
          category: selectedVideo.category,
          rating: Number(selectedVideo.rating),
          videoUrl: selectedVideo.videos?.[0] || "",
        }),
      })

      if (!response.ok) throw new Error("Failed to update video")

      const updatedVideo = await response.json()
      setVideos(prev => prev.map(video => 
        video.id === updatedVideo.id ? updatedVideo : video
      ))
      setIsEditDialogOpen(false)
      showSuccess("Video updated successfully")
    } catch (error) {
      showError("Failed to update video. Please try again.")
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!videoId || !courseId) {
      showError("Invalid video ID")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete video")

      setVideos(prev => prev.filter(video => video.id !== videoId))
      showSuccess("Video deleted successfully")
    } catch (error) {
      showError("Failed to delete video. Please try again.")
    }
  }

  const filteredVideos = videos.filter(video =>
    (video?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (video?.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4 mt-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 mx-4 mt-4">
          {success}
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Manage your course videos here.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Video
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
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
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Rating</TableHead>
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
                    <TableCell className="hidden md:table-cell">{video.category}</TableCell>
                    <TableCell className="hidden md:table-cell">${video.price}</TableCell>
                    <TableCell className="hidden md:table-cell">{video.rating}/5</TableCell>
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
                          <DropdownMenuItem onClick={() => {
                            const videoPath = video.videos?.[0];
                            if (videoPath) {
                              const videoUrl = `${import.meta.env.VITE_API_URL}/${videoPath}`;
                              window.open(videoUrl, '_blank');
                            }
                          }}>
                            <Video className="mr-2 h-4 w-4" /> Preview Video
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
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
        )}
      </CardContent>

      {/* Add Video Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleAddVideo}>
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>Add a new video with details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter video description"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  className="h-20"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter video price"
                  value={newVideo.price}
                  onChange={(e) => setNewVideo({ ...newVideo, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter video category"
                  value={newVideo.category}
                  onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Enter video rating"
                  value={newVideo.rating}
                  onChange={(e) => setNewVideo({ ...newVideo, rating: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="Enter video path (e.g., uploads/videos/video.mp4)"
                  value={newVideo.videoUrl}
                  onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">
                  Add a local video path for your video
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setNewVideo({
                    title: "",
                    description: "",
                    price: 0,
                    category: "",
                    rating: 0,
                    videoUrl: "",
                  })
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Video
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Video Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedVideo && (
            <form onSubmit={handleEditVideo}>
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
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedVideo.price}
                    onChange={(e) => setSelectedVideo({ ...selectedVideo, price: parseFloat(e.target.value) })}
                    placeholder="Enter video price"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={selectedVideo.category}
                    onChange={(e) => setSelectedVideo({ ...selectedVideo, category: e.target.value })}
                    placeholder="Enter video category"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-rating">Rating</Label>
                  <Input
                    id="edit-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={selectedVideo.rating}
                    onChange={(e) => setSelectedVideo({ ...selectedVideo, rating: parseFloat(e.target.value) })}
                    placeholder="Enter video rating"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-video">Video URL</Label>
                  <Input
                    id="edit-video"
                    type="url"
                    value={selectedVideo.videos?.[0] || ""}
                    onChange={(e) => setSelectedVideo({ ...selectedVideo, videos: [e.target.value] })}
                    placeholder="Enter video path (e.g., uploads/videos/video.mp4)"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const videoPath = selectedVideo.videos?.[0];
                      if (videoPath) {
                        const videoUrl = `${import.meta.env.VITE_API_URL}/${videoPath}`;
                        window.open(videoUrl, '_blank');
                      }
                    }}
                    className="mt-2"
                  >
                    <Video className="mr-2 h-4 w-4" /> Preview Video
                  </Button>
                  {selectedVideo.videos?.[0] && (
                    <video 
                      controls 
                      className="w-full mt-2 rounded-lg" 
                      src={`${import.meta.env.VITE_API_URL}/${selectedVideo.videos[0]}`}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
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
