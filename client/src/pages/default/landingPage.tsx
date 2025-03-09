"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Star, Book, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface Course {

  id: string
  title: string
  description: string
  instructor?: string
  thumbnail?: string
  price: number
  discountedPrice?: number
  rating: number
  videoUrl:string

}

interface RootState {
  auth: {
    user: {
      userId: string
      name: string
      email: string
      role: string
      token: string
    } | null
  }
}

function Carousel({ courses }: { courses: Course[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!courses.length) return null

  const course = courses[currentIndex]

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Gradient */}
      <div className="absolute inset-0">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg mb-6">{course.description}</p>
            <div className="flex items-center gap-4 mb-6">
              {course.instructor && (
                <div className="flex items-center gap-2">
                  <span>By {course.instructor}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{course.rating.toFixed(1)}</span>
                {course.totalRatings && (
                  <span>({course.totalRatings} ratings)</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                View Course
              </Button>
              <div className="text-2xl font-bold">
                {course.discountedPrice ? (
                  <div className="flex items-center gap-2">
                    <span>₹{course.discountedPrice}</span>
                    <span className="text-lg text-gray-400 line-through">₹{course.price}</span>
                  </div>
                ) : (
                  <span>₹{course.price}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])

  // Get user from Redux store
  const user = useSelector((state: RootState) => state.auth.user)

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }
        const response = await fetch('http://localhost:5000/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          
          return
        }
        const data = await response.json()
        setCourses(data)
        setLoading(false)
      } catch (error) {

        console.error(error)
    
    
      }}
      fetchCourses()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Featured Courses Carousel */}
      {!loading && courses.length > 0 && (
        <Carousel courses={courses.filter(course => course.isPopular)} />
      )}
      
      {/* Courses */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">All Courses</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-5/6 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course._id} 
                course={course} 
                isTeacher={user?.role === "teacher" && user?.userId === course.teacher}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              Check back later for new courses
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

interface CourseCardProps {
  course: Course
  isTeacher: boolean
}

function CourseCard({ course, isTeacher }: CourseCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="relative">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-40 bg-muted rounded-t-lg flex items-center justify-center">
              <Book className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {course.isNew && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              New
            </span>
          )}
          {course.isPopular && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
              Popular
            </span>
          )}
        </div>
        <CardTitle className="line-clamp-2 mt-4">{course.title}</CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <span>Category: {course.category}</span>
          {course.level && <span>Level: {course.level}</span>}
          {course.duration && <span>Duration: {course.duration}</span>}
          {course.instructor && <span>Instructor: {course.instructor}</span>}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
            {course.totalRatings && (
              <span className="text-sm text-muted-foreground">
                ({course.totalRatings} ratings)
              </span>
            )}
          </div>
          {course.totalStudents && (
            <span className="text-sm text-muted-foreground">
              {course.totalStudents} students
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div>
          {course.discountedPrice ? (
            <div className="flex flex-col">
              <span className="text-lg font-bold">₹{course.discountedPrice}</span>
              <span className="text-sm text-muted-foreground line-through">₹{course.price}</span>
            </div>
          ) : (
            <span className="text-lg font-bold">₹{course.price}</span>
          )}
        </div>
        <div className="flex gap-2">
          {isTeacher && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dashboard/course/${course._id}/edit`)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/course/${course._id}`)}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function generateSampleCourses(): Course[] {
  return [
    {
      _id: "1",
      title: "Complete Web Development Bootcamp",
      description: "Learn web development from scratch with HTML, CSS, JavaScript, React, and Node.js",
      instructor: "John Doe",
      thumbnail: "https://res.cloudinary.com/dkijqjo8r/image/upload/v1741471291/web-dev.jpg",
      price: 1999,
      discountedPrice: 1499,
      rating: 4.8,
      totalRatings: 150,
      totalStudents: 1000,
      duration: "20 hours",
      level: "Beginner",
      category: "Programming",
      tags: ["JavaScript", "React", "Node.js"],
      isPopular: true,
      isNew: true,
      videos: [
        "https://res.cloudinary.com/dkijqjo8r/video/upload/v1741471291/13168516_1920_1080_24fps_yqdlbs.mp4"
      ],
      teacher: "user123"
    },
    {
      _id: "2",
      title: "UI/UX Design Masterclass",
      description: "Master modern UI/UX design principles and create stunning user interfaces",
      instructor: "Sarah Wilson",
      thumbnail: "https://res.cloudinary.com/dkijqjo8r/image/upload/v1741471291/design.jpg",
      price: 2499,
      discountedPrice: 1999,
      rating: 4.9,
      totalRatings: 200,
      totalStudents: 1500,
      duration: "25 hours",
      level: "Intermediate",
      category: "Design",
      tags: ["UI", "UX", "Figma"],
      isPopular: true,
      isNew: false,
      videos: [
        "https://res.cloudinary.com/dkijqjo8r/video/upload/v1741471291/13168516_1920_1080_24fps_yqdlbs.mp4"
      ],
      teacher: "user456"
    },
    {
      _id: "3",
      title: "Digital Marketing Fundamentals",
      description: "Learn essential digital marketing strategies and tools",
      instructor: "Mike Brown",
      thumbnail: "https://res.cloudinary.com/dkijqjo8r/image/upload/v1741471291/marketing.jpg",
      price: 1799,
      rating: 4.7,
      totalRatings: 120,
      totalStudents: 800,
      duration: "15 hours",
      level: "All Levels",
      category: "Marketing",
      tags: ["SEO", "Social Media", "Analytics"],
      isPopular: false,
      isNew: true,
      videos: [
        "https://res.cloudinary.com/dkijqjo8r/video/upload/v1741471291/13168516_1920_1080_24fps_yqdlbs.mp4"
      ],
      teacher: "user789"
    }
  ]
}
