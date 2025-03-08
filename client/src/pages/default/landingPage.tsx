"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Calendar, Clock, Star, ChevronLeft, ChevronRight, Filter, BookOpen } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PromotionCarousel } from "./promotional-carousel"
import { CategoryCards } from "./category-cards"
import { Footer } from "./footer"

// Interfaces
interface Course {
  id: string
  title: string
  instructor: string
  thumbnail: string
  price: number
  discountedPrice?: number
  rating: number
  totalRatings: number
  totalStudents: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  category: string
  tags: string[]
  isPopular?: boolean
  isNew?: boolean
}

interface FilterState {
  categories: string[]
  levels: string[]
  priceRange: string
  duration: string
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const coursesPerPage = 6
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    levels: [],
    priceRange: "all",
    duration: "all"
  })
  
  const [sortOption, setSortOption] = useState("popular")

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          navigate("/login")
          return
        }

        // Construct query params
        const params = new URLSearchParams()
        params.append("page", currentPage.toString())
        params.append("limit", coursesPerPage.toString())
        if (searchQuery) params.append("search", searchQuery)
        if (sortOption) params.append("sort", sortOption)
        if (filters.categories.length) params.append("categories", filters.categories.join(","))
        if (filters.levels.length) params.append("levels", filters.levels.join(","))
        if (filters.priceRange !== "all") params.append("priceRange", filters.priceRange)
        if (filters.duration !== "all") params.append("duration", filters.duration)

        const response = await fetch(`/api/courses?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }

        const data = await response.json()
        setCourses(data.courses)
        setTotalPages(data.totalPages)
        
        // Also fetch recommended courses
        const recommendedResponse = await fetch("/api/courses/recommended", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (recommendedResponse.ok) {
          const recommendedData = await recommendedResponse.json()
          setRecommendedCourses(recommendedData.courses)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive"
        })
        
        // Set sample data for preview
        const sampleCourses = generateSampleCourses()
        setCourses(sampleCourses.slice(0, coursesPerPage))
        setTotalPages(Math.ceil(sampleCourses.length / coursesPerPage))
        setRecommendedCourses(sampleCourses.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [navigate, toast, currentPage, searchQuery, sortOption, filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleFilterChange = (filterType: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleCategoryClick = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: [category]
    }))
    setCurrentPage(1)
    window.scrollTo({
      top: document.getElementById('courses-section')?.offsetTop || 0,
      behavior: 'smooth'
    })
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      levels: [],
      priceRange: "all",
      duration: "all"
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Search */}
      <header className="bg-background py-4 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Evolve Learning Platform</h1>
          <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1">
        {/* Promotions Carousel */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4">
            <PromotionCarousel />
          </div>
        </section>
        
        {/* Domain Categories */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Explore Categories</h2>
            <CategoryCards onCategoryClick={handleCategoryClick} />
          </div>
        </section>
        
        {/* Courses Section */}
        <section id="courses-section" className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-bold">Browse Courses</h2>
              <div className="flex items-center mt-4 sm:mt-0 space-x-2">
                {/* Filter Button - For Mobile */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="sm:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Filter courses by category, level, price, and duration.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Categories</h3>
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`mobile-category-${category}`}
                              checked={filters.categories.includes(category)}
                              onChange={(e) => {
                                const newCategories = e.target.checked
                                  ? [...filters.categories, category]
                                  : filters.categories.filter(c => c !== category);
                                handleFilterChange('categories', newCategories);
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor={`mobile-category-${category}`} className="text-sm">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Level</h3>
                        {levels.map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`mobile-level-${level}`}
                              checked={filters.levels.includes(level)}
                              onChange={(e) => {
                                const newLevels = e.target.checked
                                  ? [...filters.levels, level]
                                  : filters.levels.filter(l => l !== level);
                                handleFilterChange('levels', newLevels);
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor={`mobile-level-${level}`} className="text-sm">
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <Select
                          value={filters.priceRange}
                          onValueChange={(value) => handleFilterChange('priceRange', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="under500">Under ₹500</SelectItem>
                            <SelectItem value="500to1000">₹500 - ₹1000</SelectItem>
                            <SelectItem value="1000to2000">₹1000 - ₹2000</SelectItem>
                            <SelectItem value="over2000">Over ₹2000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Duration</h3>
                        <Select
                          value={filters.duration}
                          onValueChange={(value) => handleFilterChange('duration', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Duration</SelectItem>
                            <SelectItem value="short">Short (0-3 hours)</SelectItem>
                            <SelectItem value="medium">Medium (3-6 hours)</SelectItem>
                            <SelectItem value="long">Long (6+ hours)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={clearFilters}>Reset Filters</Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button>Apply Filters</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                
                {/* Desktop Filters - Dropdowns */}
                <div className="hidden sm:flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Categories
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {categories.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            const newCategories = checked
                              ? [...filters.categories, category]
                              : filters.categories.filter(c => c !== category);
                            handleFilterChange('categories', newCategories);
                          }}
                        >
                          {category}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Level</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Select Levels</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {levels.map((level) => (
                        <DropdownMenuCheckboxItem
                          key={level}
                          checked={filters.levels.includes(level)}
                          onCheckedChange={(checked) => {
                            const newLevels = checked
                              ? [...filters.levels, level]
                              : filters.levels.filter(l => l !== level);
                            handleFilterChange('levels', newLevels);
                          }}
                        >
                          {level}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="under500">Under ₹500</SelectItem>
                      <SelectItem value="500to1000">₹500 - ₹1000</SelectItem>
                      <SelectItem value="1000to2000">₹1000 - ₹2000</SelectItem>
                      <SelectItem value="over2000">Over ₹2000</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.duration}
                    onValueChange={(value) => handleFilterChange('duration', value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Duration</SelectItem>
                      <SelectItem value="short">Short (0-3 hours)</SelectItem>
                      <SelectItem value="medium">Medium (3-6 hours)</SelectItem>
                      <SelectItem value="long">Long (6+ hours)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Reset
                  </Button>
                </div>
                
                <Select
                  value={sortOption}
                  onValueChange={setSortOption}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(filters.categories.length > 0 || filters.levels.length > 0 || 
              filters.priceRange !== 'all' || filters.duration !== 'all' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                
                {filters.categories.map(category => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <button 
                      onClick={() => handleFilterChange('categories', filters.categories.filter(c => c !== category))}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {filters.levels.map(level => (
                  <Badge key={level} variant="secondary" className="flex items-center gap-1">
                    {level}
                    <button 
                      onClick={() => handleFilterChange('levels', filters.levels.filter(l => l !== level))}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {filters.priceRange !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getPriceRangeLabel(filters.priceRange)}
                    <button 
                      onClick={() => handleFilterChange('priceRange', 'all')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {filters.duration !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getDurationLabel(filters.duration)}
                    <button 
                      onClick={() => handleFilterChange('duration', 'all')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                  Clear All
                </Button>
              </div>
            )}
            
            {/* Course Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="h-44 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </CardContent>
                    <CardFooter>
                      <div className="h-8 bg-muted rounded w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && courses.length > 0 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Recommended Section */}
        {recommendedCourses.length > 0 && (
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} isCompact />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

// Helper components

interface CourseCardProps {
  course: Course
  isCompact?: boolean
}

function CourseCard({ course, isCompact = false }: CourseCardProps) {
  const navigate = useNavigate()
  
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <div 
        className="relative h-44 bg-muted cursor-pointer"
        onClick={() => navigate(`/courses/${course.id}`)}
      >
        <img 
          src={course.thumbnail || `/placeholder.svg?height=176&width=360`} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.discountedPrice && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}% OFF
          </Badge>
        )}
        {course.isNew && (
          <Badge className="absolute top-2 left-2 bg-blue-500">NEW</Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle 
          className={`line-clamp-2 cursor-pointer hover:text-primary ${isCompact ? 'text-base' : 'text-lg'}`}
          onClick={() => navigate(`/courses/${course.id}`)}
        >
          {course.title}
        </CardTitle>
        <CardDescription className="flex items-center">
          {course.instructor}
        </CardDescription>
      </CardHeader>
      <CardContent className={`px-4 pb-0 ${isCompact ? 'pt-0' : 'pt-2'}`}>
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="ml-1 text-xs">({course.totalRatings})</span>
          </div>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{course.duration}</span>
          </div>
          {!isCompact && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{course.level}</span>
              </div>
            </>
          )}
        </div>
        
        {!isCompact && (
          <div className="mt-2 flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {course.discountedPrice ? (
              <>
                <span className="font-bold text-lg">₹{course.discountedPrice}</span>
                <span className="ml-2 line-through text-muted-foreground text-sm">
                  ₹{course.price}
                </span>
              </>
            ) : course.price === 0 ? (
              <span className="font-bold text-lg text-green-600">Free</span>
            ) : (
              <span className="font-bold text-lg">₹{course.price}</span>
            )}
          </div>
          <Button 
            size={isCompact ? "sm" : "default"}
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            View Course
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper functions and sample data
function generateSampleCourses(): Course[] {
  const sampleCourses: Course[] = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp 2023",
      instructor: "Dr. Angela Yu",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1999,
      discountedPrice: 499,
      rating: 4.7,
      totalRatings: 482,
      totalStudents: 2540,
      duration: "42h 30m",
      level: "All Levels",
      category: "Web Development",
      tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      isPopular: true,
      isNew: false,
    },
    {
      id: "2",
      title: "Machine Learning A-Z: Hands-On Python & R",
      instructor: "Kirill Eremenko",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 2499,
      rating: 4.5,
      totalRatings: 356,
      totalStudents: 1800,
      duration: "38h 15m",
      level: "Intermediate",
      category: "Data Science",
      tags: ["Python", "R", "Machine Learning", "Data Science"],
      isPopular: true,
    },
    {
      id: "3",
      title: "Modern JavaScript: From Fundamentals to Advanced",
      instructor: "Maximilian Schwarzmüller",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1799,
      discountedPrice: 599,
      rating: 4.8,
      totalRatings: 290,
      totalStudents: 1450,
      duration: "28h 45m",
      level: "Beginner",
      category: "Programming",
      tags: ["JavaScript", "ES6", "APIs", "Async/Await"],
    },
    {
      id: "4",
      title: "Advanced React and Redux: 2023 Edition",
      instructor: "Stephen Grider",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1899,
      rating: 4.6,
      totalRatings: 215,
      totalStudents: 1220,
      duration: "24h 10m",
      level: "Intermediate",
      category: "Web Development",
      tags: ["React", "Redux", "Frontend", "JavaScript"],
    },
    {
      id: "5",
      title: "Python for Data Science and Machine Learning Bootcamp",
      instructor: "Jose Portilla",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1299,
      discountedPrice: 449,
      rating: 4.5,
      totalRatings: 332,
      totalStudents: 1680,
      duration: "22h 30m",
      level: "Intermediate",
      category: "Data Science",
      tags: ["Python", "NumPy", "Pandas", "Matplotlib", "Scikit-Learn"],
    },
    {
      id: "6",
      title: "The Complete Android 12 & Kotlin Development Masterclass",
      instructor: "Paulo Dichone",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 2299,
      rating: 4.4,
      totalRatings: 178,
      totalStudents: 920,
      duration: "32h 15m",
      level: "All Levels",
      category: "Mobile Development",
      tags: ["Android", "Kotlin", "Mobile", "Firebase"],
      isNew: true,
    },
    {
      id: "7",
      title: "AWS Certified Solutions Architect - Associate",
      instructor: "Stephane Maarek",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 3499,
      discountedPrice: 1299,
      rating: 4.7,
      totalRatings: 412,
      totalStudents: 2100,
      duration: "27h 20m",
      level: "Intermediate",
      category: "Cloud Computing",
      tags: ["AWS", "Cloud", "DevOps", "Architecture"],
      isPopular: true,
    },
    {
      id: "8",
      title: "UI/UX Design: Create Modern Web Experiences",
      instructor: "Daniel Walter Scott",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1599,
      rating: 4.8,
      totalRatings: 264,
      totalStudents: 1340,
      duration: "18h 45m",
      level: "Beginner",
      category: "Design",
      tags: ["UI/UX", "Figma", "Adobe XD", "Design Principles"],
    },
    {
      id: "9",
      title: "Complete Digital Marketing Course - 12 Courses in 1",
      instructor: "Rob Percival & Daragh Walsh",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1999,
      discountedPrice: 599,
      rating: 4.5,
      totalRatings: 352,
      totalStudents: 1820,
      duration: "38h 30m",
      level: "All Levels",
      category: "Marketing",
      tags: ["SEO", "Facebook Ads", "Google Ads", "Social Media"],
    },
    {
      id: "10",
      title: "The Complete 2023 Flutter Development Bootcamp",
      instructor: "Dr. Angela Yu",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1899,
      rating: 4.6,
      totalRatings: 220,
      totalStudents: 1120,
      duration: "26h 15m",
      level: "Beginner",
      category: "Mobile Development",
      tags: ["Flutter", "Dart", "Mobile", "Cross-Platform"],
      isNew: true,
    },
    {
      id: "11",
      title: "Blockchain A-Z™: Learn Blockchain Technology",
      instructor: "Hadelin de Ponteves",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1599,
      discountedPrice: 499,
      rating: 4.4,
      totalRatings: 186,
      totalStudents: 980,
      duration: "14h 30m",
      level: "Intermediate",
      category: "Blockchain",
      tags: ["Blockchain", "Cryptocurrency", "Smart Contracts"],
    },
    {
      id: "12",
      title: "Learn Ethical Hacking From Scratch",
      instructor: "Zaid Sabih",
      thumbnail: "/placeholder.svg?height=176&width=360",
      price: 1999,
      rating: 4.6,
      totalRatings: 328,
      totalStudents: 1650,
      duration: "24h 45m",
      level: "All Levels",
      category: "Cybersecurity",
      tags: ["Hacking", "Security", "Penetration Testing", "Kali Linux"],
      isPopular: true,
    },
  ]

  return sampleCourses
}

function getPriceRangeLabel(priceRange: string): string {
  switch (priceRange) {
    case "free": return "Free"
    case "paid": return "Paid"
    case "under500": return "Under ₹500"
    case "500to1000": return "₹500 - ₹1000"
    case "1000to2000": return "₹1000 - ₹2000"
    case "over2000": return "Over ₹2000"
    default: return "All Prices"
  }
}

function getDurationLabel(duration: string): string {
  switch (duration) {
    case "short": return "Short (0-3 hours)"
    case "medium": return "Medium (3-6 hours)"
    case "long": return "Long (6+ hours)"
    default: return "Any Duration"
  }
}

// Sample categories
const categories = [
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Programming",
  "Design",
  "Marketing",
  "Business",
  "Finance",
  "Cloud Computing",
  "Cybersecurity",
  "Blockchain",
]

// Sample levels
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]
