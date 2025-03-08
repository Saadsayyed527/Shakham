"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { ChevronLeft, Clock, Play, PlayCircle, Star } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface Lecture {
  id: string
  title: string
  duration: string
  isCompleted: boolean
}

interface Section {
  id: string
  title: string
  lectures: Lecture[]
}

interface Course {
  id: string
  title: string
  instructor: string
  rating: number
  totalStudents: number
  description: string
  sections: Section[]
  progress: number
  isEnrolled: boolean
}

export default function CourseContent() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [course, setCourse] = useState<Course>({
    id: "1",
    title: "Complete Web Development Bootcamp",
    instructor: "Jane Smith",
    rating: 4.8,
    totalStudents: 12543,
    description: "Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js and more. By the end of this course, you'll be able to build complete web applications.",
    sections: [
      {
        id: "s1",
        title: "Getting Started with Web Development",
        lectures: [
          { id: "l1", title: "Introduction to Web Development", duration: "10:25", isCompleted: true },
          { id: "l2", title: "Setting Up Your Development Environment", duration: "15:30", isCompleted: true },
          { id: "l3", title: "Understanding How the Web Works", duration: "12:15", isCompleted: false },
        ]
      },
      {
        id: "s2",
        title: "HTML Fundamentals",
        lectures: [
          { id: "l4", title: "HTML Document Structure", duration: "08:45", isCompleted: false },
          { id: "l5", title: "Working with Text Elements", duration: "14:20", isCompleted: false },
          { id: "l6", title: "Creating Links and Navigation", duration: "11:55", isCompleted: false },
          { id: "l7", title: "HTML Forms and Input Elements", duration: "18:30", isCompleted: false },
        ]
      },
      {
        id: "s3",
        title: "CSS Styling",
        lectures: [
          { id: "l8", title: "CSS Selectors and Properties", duration: "16:40", isCompleted: false },
          { id: "l9", title: "Box Model and Layout", duration: "20:15", isCompleted: false },
          { id: "l10", title: "Responsive Design with CSS", duration: "22:30", isCompleted: false },
        ]
      }
    ],
    progress: 25,
    isEnrolled: true
  })

  const handleWatchVideo = (lectureId: string) => {
    if (!course.isEnrolled) {
      toast({
        title: "Not enrolled",
        description: "Please enroll in this course to watch the videos.",
        variant: "destructive"
      })
      return
    }
    
    navigate(`/video/${course.id}/${lectureId}`)
  }

  const totalLectures = course.sections.reduce((acc, section) => acc + section.lectures.length, 0)
  const completedLectures = course.sections.reduce(
    (acc, section) => acc + section.lectures.filter(lecture => lecture.isCompleted).length,
    0
  )

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/courses">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to courses</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{course.title}</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>By {course.instructor}</span>
              <span>•</span>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                <span>{course.rating}</span>
              </div>
              <span>•</span>
              <span>{course.totalStudents.toLocaleString()} students</span>
            </div>
          </div>
        </div>

        {course.isEnrolled && (
          <Card className="bg-muted/40">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Your progress</span>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completedLectures} of {totalLectures} lectures completed
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* Course Content */}
          <TabsContent value="content" className="mt-6">
            {course.sections.map((section, index) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>Section {index + 1}: {section.title}</CardTitle>
                  <CardDescription>
                    {section.lectures.length} lectures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {section.lectures.map((lecture) => (
                    <div key={lecture.id} className="flex justify-between">
                      <Button onClick={() => handleWatchVideo(lecture.id)}>
                        <Play className="mr-2" />
                        {lecture.title}
                      </Button>
                      {lecture.isCompleted && (
                        <span className="text-green-500">✔ Completed</span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Course Overview */}
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardContent>
                <p>{course.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
