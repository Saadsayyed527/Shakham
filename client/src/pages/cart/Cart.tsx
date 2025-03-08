import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Check, Loader2, ShoppingCart, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  title: string
  instructor: string
  price: number
  originalPrice: number
  discount: number
  image: string
}

export default function Cart() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)

  // Mock data - in a real app, this would come from an API or state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      instructor: "Jane Smith",
      price: 59.99,
      originalPrice: 199.99,
      discount: 70,
      image: "/placeholder.svg?height=100&width=180",
    },
    {
      id: "2",
      title: "Advanced JavaScript: From Fundamentals to Functional JS",
      instructor: "Michael Johnson",
      price: 49.99,
      originalPrice: 149.99,
      discount: 67,
      image: "/placeholder.svg?height=100&width=180",
    },
  ])

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))

    toast({
      title: "Item removed",
      description: "The course has been removed from your cart.",
    })
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return

    setIsLoading(true)

    // Simulate API call to validate coupon
    setTimeout(() => {
      if (couponCode.toLowerCase() === "learn25") {
        setCouponApplied(true)
        setCouponDiscount(25)
        toast({
          title: "Coupon applied",
          description: "25% discount has been applied to your order.",
        })
      } else {
        toast({
          title: "Invalid coupon",
          description: "The coupon code you entered is invalid or expired.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleCheckout = () => {
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)

      // Redirect to success page or show success message
      toast({
        title: "Payment successful",
        description: "Your order has been processed successfully.",
      })

      navigate("/profile")
    }, 2000)
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0)
  const discount = couponApplied ? (subtotal * couponDiscount) / 100 : 0
  const total = subtotal - discount

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="rounded-full bg-muted p-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground max-w-md">
            Looks like you haven't added any courses to your cart yet. Browse our courses and find something you'd like
            to learn.
          </p>
          <Button asChild size="lg">
            <Link to="/courses">
              Browse Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 md:text-3xl">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-[180px] h-[100px] bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">By {item.instructor}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">${item.price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.discount}% off
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove {item.title}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order before checkout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-primary">
                    <span>Coupon Discount ({couponDiscount}%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
