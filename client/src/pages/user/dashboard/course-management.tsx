import { useState, useEffect, useRef } from "react"
import { Edit, MoreHorizontal, Plus, Trash, Eye, Loader2, X, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface Course {
  _id?: string
  title: string
  description: string
  category: string
  price: number
  rating: number
  videos: string[]
  teacher?: string
}

const DEFAULT_VIDEO_URL = "https://res.cloudinary.com/dkijqjo8r/video/upload/v1741471291/13168516_1920_1080_24fps_yqdlbs.mp4"

const COURSE_CATEGORIES = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Personal Development",
  "Music",
  "Photography",
  "Other"
]

const validateVideoUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('cloudinary.com') 
      ? null 
      : 'Only Cloudinary videos are supported'
  } catch {
    return 'Invalid URL format'
  }
}

export function CourseManagement() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCategory, setCourseCategory] = useState("")
  const [price, setPrice] = useState(0)
  const [rating, setRating] = useState(0)
  const [videoUrls, setVideoUrls] = useState("")
  const [videoErrors, setVideoErrors] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [editVideoUrls, setEditVideoUrls] = useState("")
  const [editVideoErrors, setEditVideoErrors] = useState<string[]>([])
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [videoLoadAttempts, setVideoLoadAttempts] = useState(0)

  const resetStates = () => {
    setIsSubmitting(false)
    setVideoLoading(false)
    setVideoError(false)
    setVideoLoadAttempts(0)
    setCourseTitle("")
    setCourseDescription("")
    setCourseCategory("")
    setPrice(0)
    setRating(0)
    setVideoUrls("")
    setVideoErrors([])
    setEditVideoUrls("")
    setEditVideoErrors([])
  }

  const handleError = (error: unknown) => {
    console.error('Error:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive",
    })
  }

  const handleApiError = async (response: Response) => {
    let errorMessage = 'An unexpected error occurred'
    try {
      const data = await response.json()
      errorMessage = data.message || errorMessage
    } catch {
      // If JSON parsing fails, try to get the status text
      errorMessage = response.statusText || errorMessage
    }
    throw new Error(errorMessage)
  }

  const handleNetworkError = (error: unknown) => {
    console.error('Network error:', error)
    const isOffline = !navigator.onLine
    const message = isOffline 
      ? 'You are offline. Please check your internet connection.'
      : 'Network error. Please try again later.'
    
    toast({
      title: "Connection Error",
      description: message,
      variant: "destructive",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const error = validateVideoUrl(videoUrls)
      if (error) {
        setVideoErrors([error])
        throw new Error('Invalid video URL')
      }

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }

      const newCourse = {
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        price: Number(price),
        rating: Number(rating),
        videos: [videoUrls]
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create course')
      }

      const data = await response.json()
      setCourses(prev => [...prev, data])
      setIsAddDialogOpen(false)
      resetStates()
      toast({
        title: "Success",
        description: "Course created successfully",
      })
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse?._id) return

    setIsSubmitting(true)

    try {
      const error = validateVideoUrl(editVideoUrls)
      if (error) {
        setEditVideoErrors([error])
        throw new Error('Invalid video URL')
      }

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }

      const updatedCourse = {
        title: selectedCourse.title,
        description: selectedCourse.description,
        category: selectedCourse.category,
        price: selectedCourse.price,
        rating: selectedCourse.rating,
        videos: [editVideoUrls]
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCourse),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update course')
      }

      const data = await response.json()
      setCourses(prev => prev.map(course => 
        course._id === selectedCourse._id ? data : course
      ))
      setIsEditDialogOpen(false)
      setSelectedCourse(null)
      setEditVideoUrls("")
      setEditVideoErrors([])
      toast({
        title: "Success",
        description: "Course updated successfully",
      })
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      setIsSubmitting(true)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(error => {
        handleNetworkError(error)
        throw error
      })

      if (!response.ok) {
        await handleApiError(response)
      }

      setCourses(prev => prev.filter(course => course._id !== courseId))
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (courseId: string | undefined) => {
    if (!courseId) {
      toast({
        title: "Error",
        description: "Invalid course ID",
        variant: "destructive",
      })
      return
    }
    try {
      setIsSubmitting(true)
      await handleDeleteCourse(courseId)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVideoClick = (course: Course) => {
    if (!course._id) return
    const videoUrl = course.videos[0]
    if (videoUrl) {
      handlePreviewVideo(videoUrl, course.title)
    } else {
      toast({
        title: "Error",
        description: "No video available for this course",
        variant: "destructive",
      })
    }
  }

  const handlePreviewVideo = (videoUrl: string, courseTitle: string) => {
    try {
      setPreviewUrl(videoUrl)
      setPreviewTitle(courseTitle)
      setVideoLoading(true)
      setVideoError(false)
      setVideoLoadAttempts(0)
      setIsPreviewDialogOpen(true)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error('Authentication required. Please log in again.')
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(error => {
          handleNetworkError(error)
          throw error
        })

        if (!response.ok) {
          await handleApiError(response)
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Management</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-muted-foreground mb-4">No courses found</div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Course
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>₹{course.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{course.rating.toFixed(1)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleVideoClick(course)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedCourse(course)
                              setIsEditDialogOpen(true)
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(course._id!)}
                              className="text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetStates()
          setIsAddDialogOpen(false)
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  placeholder="Enter course category"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  placeholder="Enter rating"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Enter course description"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videos">Video URL</Label>
              <Input
                id="videos"
                value={videoUrls}
                onChange={(e) => {
                  const url = e.target.value;
                  setVideoUrls(url);
                  const error = validateVideoUrl(url);
                  setVideoErrors(error ? [error] : []);
                }}
                placeholder="Enter Cloudinary video URL"
                className={videoErrors.length > 0 ? "border-destructive" : ""}
              />
              {videoErrors.map((error, i) => (
                <p key={i} className="text-sm text-destructive flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              ))}
              <p className="text-xs text-muted-foreground">
                Only Cloudinary videos are supported
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  resetStates()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || videoErrors.length > 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetStates()
          setIsEditDialogOpen(false)
          setSelectedCourse(null)
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCourse} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Course Title</Label>
                <Input
                  id="edit-title"
                  value={selectedCourse?.title || ""}
                  onChange={(e) =>
                    setSelectedCourse(prev => prev ? { ...prev, title: e.target.value } : null)
                  }
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={selectedCourse?.category || ""}
                  onChange={(e) =>
                    setSelectedCourse(prev => prev ? { ...prev, category: e.target.value } : null)
                  }
                  placeholder="Enter course category"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  value={selectedCourse?.price || 0}
                  onChange={(e) =>
                    setSelectedCourse(prev => prev ? { ...prev, price: Number(e.target.value) } : null)
                  }
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rating">Rating</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={selectedCourse?.rating || 0}
                  onChange={(e) =>
                    setSelectedCourse(prev => prev ? { ...prev, rating: Number(e.target.value) } : null)
                  }
                  placeholder="Enter rating"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={selectedCourse?.description || ""}
                onChange={(e) =>
                  setSelectedCourse(prev => prev ? { ...prev, description: e.target.value } : null)
                }
                placeholder="Enter course description"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-videos">Video URL</Label>
              <Input
                id="edit-videos"
                value={editVideoUrls || (selectedCourse?.videos || []).join(", ")}
                onChange={(e) => {
                  const url = e.target.value;
                  setEditVideoUrls(url);
                  const error = validateVideoUrl(url);
                  setEditVideoErrors(error ? [error] : []);
                }}
                placeholder="Enter Cloudinary video URL"
                className={editVideoErrors.length > 0 ? "border-destructive" : ""}
              />
              {editVideoErrors.map((error, i) => (
                <p key={i} className="text-sm text-destructive flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              ))}
              <p className="text-xs text-muted-foreground">
                Only Cloudinary videos are supported
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setSelectedCourse(null)
                  setEditVideoUrls("")
                  setEditVideoErrors([])
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || editVideoErrors.length > 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Course'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetStates()
          setIsPreviewDialogOpen(false)
          setPreviewUrl("")
          setPreviewTitle("")
        }
      }}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Video Preview - {previewTitle}</span>
                {videoLoading && !videoError && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading... Attempt {videoLoadAttempts + 1}/3
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setVideoLoading(false)
                  setVideoError(false)
                  setIsPreviewDialogOpen(false)
                  setPreviewUrl("")
                  setPreviewTitle("")
                  setVideoLoadAttempts(0)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full bg-muted rounded-lg">
            {videoLoading && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading video...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Attempt {videoLoadAttempts + 1}/3
                  </p>
                </div>
              </div>
            )}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="text-center max-w-sm">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
                    <p className="font-medium">Failed to load video</p>
                    <p className="text-sm mt-1">Please check your connection and try again</p>
                    {videoLoadAttempts >= 3 && (
                      <p className="text-xs mt-2 text-muted-foreground">Maximum retry attempts reached</p>
                    )}
                  </div>
                  {videoLoadAttempts < 3 ? (
                    <Button variant="outline" onClick={() => {
                      setVideoLoading(true)
                      setVideoError(false)
                      setVideoLoadAttempts(prev => prev + 1)
                    }}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry ({videoLoadAttempts + 1}/3)
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => {
                      setVideoLoading(false)
                      setVideoError(false)
                      setIsPreviewDialogOpen(false)
                      setPreviewUrl("")
                      setPreviewTitle("")
                      setVideoLoadAttempts(0)
                    }}>
                      Close
                    </Button>
                  )}
                </div>
              </div>
            )}
            <video 
              src={previewUrl} 
              controls 
              controlsList="nodownload"
              className="h-full w-full rounded-lg"
              onLoadStart={() => {
                setVideoLoading(true)
                setVideoError(false)
              }}
              onLoadedData={() => {
                setVideoLoading(false)
                setVideoError(false)
                toast({
                  title: "Success",
                  description: "Video loaded successfully",
                })
              }}
              onError={() => {
                setVideoLoading(false)
                setVideoError(true)
                if (videoLoadAttempts < 3) {
                  toast({
                    title: "Error",
                    description: `Failed to load video. Attempt ${videoLoadAttempts + 1}/3. Retrying...`,
                    variant: "destructive",
                  })
                } else {
                  toast({
                    title: "Error",
                    description: "Failed to load video after multiple attempts. Please try again later.",
                    variant: "destructive",
                  })
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
