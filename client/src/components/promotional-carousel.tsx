"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface Offer {
  id: number
  title: string
  description: string
  image: string
  backgroundColor: string
  textColor: string
}

const offers: Offer[] = [
  {
    id: 1,
    title: "Summer Special Offer",
    description: "Get 50% off on all courses this summer! Limited time offer.",
    image: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    backgroundColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "New Student Discount",
    description: "First course free for new students! Start your learning journey today.",
    image: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    backgroundColor: "bg-gradient-to-r from-blue-500 to-teal-500",
    textColor: "text-white"
  },
  {
    id: 3,
    title: "Premium Bundle",
    description: "Access all premium courses at 70% discount. Unlock your potential!",
    image: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    backgroundColor: "bg-gradient-to-r from-orange-500 to-red-500",
    textColor: "text-white"
  }
]

export function PromotionalCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length)
    setIsAutoPlaying(false)
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={cn(
              "min-w-full relative h-[400px] flex items-center justify-center",
              offer.backgroundColor
            )}
          >
            <div className="absolute inset-0">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className={cn("relative z-10 text-center p-8", offer.textColor)}>
              <h2 className="text-4xl font-bold mb-4">{offer.title}</h2>
              <p className="text-xl mb-8">{offer.description}</p>
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {offers.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              currentSlide === index ? "bg-white" : "bg-white/50"
            )}
            onClick={() => {
              setCurrentSlide(index)
              setIsAutoPlaying(false)
            }}
          />
        ))}
      </div>
    </div>
  )
}
