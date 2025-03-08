"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, ArrowLeft, CreditCard, Loader2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function Checkout() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.cardName.trim()) {
      errors.cardName = "Name on card is required"
    }

    if (!formData.cardNumber.trim()) {
      errors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Card number must be 16 digits"
    }

    if (!formData.expiryDate.trim()) {
      errors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = "Expiry date must be in MM/YY format"
    }

    if (!formData.cvv.trim()) {
      errors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)

      // Show success message
      toast({
        title: "Payment successful",
        description: "Your order has been processed successfully.",
      })

      // Redirect to profile page
      navigate("/profile")
    }, 2000)
  }

  // Mock order summary data
  const orderSummary = {
    subtotal: 109.98,
    discount: 27.5,
    total: 82.48,
    items: [
      { id: "1", title: "Complete Web Development Bootcamp", price: 59.99 },
      { id: "2", title: "Advanced JavaScript: From Fundamentals to Functional JS", price: 49.99 },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild onClick={() => navigate(-1)}>
          <div>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to cart</span>
          </div>
        </Button>
        <h1 className="text-2xl font-bold md:text-3xl">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit / Debit Card
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Smith"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={formErrors.cardName ? "border-destructive" : ""}
                    />
                    {formErrors.cardName && <p className="text-sm text-destructive">{formErrors.cardName}</p>}

                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={formErrors.cardNumber ? "border-destructive" : ""}
                    />
                    {formErrors.cardNumber && <p className="text-sm text-destructive">{formErrors.cardNumber}</p>}

                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={formErrors.expiryDate ? "border-destructive" : ""}
                    />
                    {formErrors.expiryDate && <p className="text-sm text-destructive">{formErrors.expiryDate}</p>}

                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={formErrors.cvv ? "border-destructive" : ""}
                    />
                    {formErrors.cvv && <p className="text-sm text-destructive">{formErrors.cvv}</p>}
                  </div>
                )}

                <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Complete Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {orderSummary.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
