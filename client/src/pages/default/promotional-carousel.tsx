"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Promotion {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
  backgroundColor?: string
  textColor?: string
}

export function PromotionCarousel() {
  const { showError } = useToast()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/promotions')
        
        if (!response.ok) {
          throw new Error('Failed to fetch promotions')
        }
        
        const data = await response.json()
        setPromotions(data)
      } catch (error) {
        // Load sample data if API fails
        setPromotions([
          {
            id: "1",
            title: "New Year Sale! 50% Off All Courses",
            description: "Start your learning journey with our biggest sale of the year. Use code NEWYEAR50 at checkout.",
            imageUrl: "/placeholder.svg?height=300&width=1200&text=New+Year+Sale",
            link: "/sale",
            backgroundColor: "bg-gradient-to-r from-blue-600 to-purple-600",
            textColor: "text-white"
          },
          {
            id: "2",
            title: "Learn Web Development From Scratch",
            description: "Complete roadmap to become a professional web developer in 2023.",
            imageUrl: "/placeholder.svg?height=300&width=1200&text=Web+Development+Course",
            link: "/courses/web-development",
            backgroundColor: "bg-gradient-to-r from-amber-500 to-pink-500",
            textColor: "text-white"
          },
          {
            id: "3",
            title: "Free AI Fundamentals Workshop",
            description: "Join our live workshop on AI basics and applications. Limited spots available!",
            imageUrl: "/placeholder.svg?height=300&width=1200&text=AI+Workshop",
            link: "/workshops/ai-fundamentals",
            backgroundColor: "bg-gradient-to-r from-green-400 to-cyan-500",
            textColor: "text-white"
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPromotions()
  }, [])

  useEffect(() => {
    // Auto-advance the carousel
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000) // Change slide every 5 seconds
    }
    
    if (promotions.length > 1 && !loading) {
      startAutoplay()
    }
    
    // Cleanup
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [promotions.length, loading])

  const handlePrevious = () => {
    // Reset the autoplay timer
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
    
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? promotions.length - 1 : prevIndex - 1
    )
    
    // Restart autoplay
    autoplayRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)
  }

  const handleNext = () => {
    // Reset the autoplay timer
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
    
    setCurrentIndex(prevIndex => 
      prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
    )
    
    // Restart autoplay
    autoplayRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)
  }

  if (loading) {
    return (
      <Card className="w-full overflow-hidden">
        <div className="h-[200px] sm:h-[250px] md:h-[300px] animate-pulse bg-muted"></div>
      </Card>
    )
  }

  if (promotions.length === 0) {
    return null
  }

  return (
    <Card className="w-full overflow-hidden relative">
      <div className="relative overflow-hidden rounded-lg">
        {promotions.map((promotion, index) => (
          <div
            key={promotion.id}
            className={`h-full w-full transition-all duration-500 ease-in-out absolute top-0 left-0 ${
              index === currentIndex 
                ? "opacity-100 translate-x-0" 
                : index < currentIndex 
                  ? "opacity-0 -translate-x-full" 
                  : "opacity-0 translate-x-full"
            }`}
            style={{ zIndex: index === currentIndex ? 1 : 0 }}
          >
            <a href={promotion.link} className="block h-full w-full">
              <div 
                className={`p-6 sm:p-8 md:p-12 h-[200px] sm:h-[250px] md:h-[300px] flex flex-col justify-center ${
                  promotion.backgroundColor || 'bg-primary'
                } ${promotion.textColor || 'text-primary-foreground'}`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0 md:w-1/2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{promotion.title}</h2>
                    <p className="text-sm sm:text-base md:text-lg opacity-90">{promotion.description}</p>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">Learn More</Button>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <img
                      src={promotion.imageUrl || "/placeholder.svg"}
                      alt={promotion.title}
                      className="max-h-[120px] sm:max-h-[150px] md:max-h-[180px] object-contain mix-blend-screen"
                    />
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
        
        {/* Navigation buttons */}
        {promotions.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {promotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    if (autoplayRef.current) {
                      clearInterval(autoplayRef.current)
                      autoplayRef.current = setInterval(() => {
                        setCurrentIndex(prevIndex => 
                          prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
                        )
                      }, 5000)
                    }
                  }}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex === index 
                      ? 'bg-primary' 
                      : 'bg-background/50 hover:bg-background/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
