"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  Code,
  LineChart,
  Lightbulb,
  Monitor,
  PenTool,
  ShoppingBag,
  Shield,
  Smartphone,
  Video,
  Book,
  Layers,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  icon: string
  courseCount: number
  color?: string
}

interface CategoryCardsProps {
  onCategoryClick: (category: string) => void
}

export function CategoryCards({ onCategoryClick }: CategoryCardsProps) {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/categories")

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()
        setCategories(data)
      } catch (error) {
        // Load sample data if API fails
        setCategories([
          { id: "1", name: "Web Development", icon: "code", courseCount: 68, color: "bg-blue-100 dark:bg-blue-900/20" },
          {
            id: "2",
            name: "Data Science",
            icon: "line-chart",
            courseCount: 45,
            color: "bg-green-100 dark:bg-green-900/20",
          },
          {
            id: "3",
            name: "Mobile Development",
            icon: "smartphone",
            courseCount: 32,
            color: "bg-yellow-100 dark:bg-yellow-900/20",
          },
          {
            id: "4",
            name: "Programming",
            icon: "terminal",
            courseCount: 56,
            color: "bg-indigo-100 dark:bg-indigo-900/20",
          },
          { id: "5", name: "Design", icon: "pen-tool", courseCount: 38, color: "bg-pink-100 dark:bg-pink-900/20" },
          {
            id: "6",
            name: "Marketing",
            icon: "shopping-bag",
            courseCount: 27,
            color: "bg-purple-100 dark:bg-purple-900/20",
          },
          {
            id: "7",
            name: "Business",
            icon: "briefcase",
            courseCount: 42,
            color: "bg-orange-100 dark:bg-orange-900/20",
          },
          { id: "8", name: "Cybersecurity", icon: "shield", courseCount: 24, color: "bg-red-100 dark:bg-red-900/20" },
          {
            id: "9",
            name: "IT & Software",
            icon: "monitor",
            courseCount: 35,
            color: "bg-cyan-100 dark:bg-cyan-900/20",
          },
          {
            id: "10",
            name: "Video Production",
            icon: "video",
            courseCount: 22,
            color: "bg-amber-100 dark:bg-amber-900/20",
          },
          {
            id: "11",
            name: "Personal Development",
            icon: "lightbulb",
            courseCount: 31,
            color: "bg-emerald-100 dark:bg-emerald-900/20",
          },
          { id: "12", name: "Education", icon: "book", courseCount: 29, color: "bg-rose-100 dark:bg-rose-900/20" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "code":
        return <Code className="h-6 w-6" />
      case "line-chart":
        return <LineChart className="h-6 w-6" />
      case "smartphone":
        return <Smartphone className="h-6 w-6" />
      case "terminal":
        return <Code className="h-6 w-6" />
      case "pen-tool":
        return <PenTool className="h-6 w-6" />
      case "shopping-bag":
        return <ShoppingBag className="h-6 w-6" />
      case "briefcase":
        return <Layers className="h-6 w-6" />
      case "shield":
        return <Shield className="h-6 w-6" />
      case "monitor":
        return <Monitor className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "lightbulb":
        return <Lightbulb className="h-6 w-6" />
      case "book":
        return <Book className="h-6 w-6" />
      default:
        return <BookOpen className="h-6 w-6" />
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-muted mb-3" />
              <div className="h-4 w-24 bg-muted rounded mb-2" />
              <div className="h-3 w-12 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`hover:shadow-md transition-shadow cursor-pointer ${category.color || ""}`}
          onClick={() => onCategoryClick(category.name)}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="mb-3 text-primary">{getIconComponent(category.icon)}</div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-xs text-muted-foreground">{category.courseCount} courses</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

