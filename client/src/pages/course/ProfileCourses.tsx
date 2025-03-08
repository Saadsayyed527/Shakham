import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen, Clock, Play, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Course {
  id: string
  title: string
  instructor: string
  image: string
  progress: number
  totalLectures: number
  completedLectures: number
  lastWatched?: {
    lectureId: string
    title: string
    timestamp: string
  }
}

export default function ProfileCourses() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - in a real app, this would come from an API
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      instructor: "Jane Smith",
      image: "/placeholder.svg",
      progress: 25,
      totalLectures: 120,
      completedLectures: 30,
      lastWatched: {
        lectureId: "l3",
        title: "Understanding How the Web Works",
        timestamp: "12:45",
      },
    },
    {
      id: "2",
      title: "Advanced JavaScript: From Fundamentals to Functional JS",
      instructor: "Michael Johnson",
      image: "/placeholder.svg",
      progress: 68,
      totalLectures: 85,
      completedLectures: 58,
      lastWatched: {
        lectureId: "l22",
        title: "Closures and Scope",
        timestamp: "08:30",
      },
    },
    {
      id: "3",
      title: "React - The Complete Guide",
      instructor: "Sarah Williams",
      image: "/placeholder.svg",
      progress: 12,
      totalLectures: 150,
      completedLectures: 18,
    },
  ])

  const filteredCourses = enrolledCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContinueLearning = (courseId: string, lectureId?: string) => {
    if (lectureId) {
      navigate(`/video/${courseId}/${lectureId}`)
    } else {
      navigate(`/course/${courseId}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">My Learning</h1>
            <p className="text-muted-foreground">Continue learning where you left off</p>
          </div>

          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your courses"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="in-progress">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-6">
            {filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">No courses found</h2>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery
                    ? "No courses match your search criteria. Try a different search term."
                    : "You haven't enrolled in any courses yet. Browse our catalog to find courses you're interested in."}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          onClick={() => handleContinueLearning(course.id, course.lastWatched?.lectureId)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {course.completedLectures} of {course.totalLectures} lectures completed
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/course/${course.id}`)}>
                        View Course
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <Star className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No completed courses yet</h2>
              <p className="text-muted-foreground max-w-md">Keep learning! You'll see your completed courses here once you finish them.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
