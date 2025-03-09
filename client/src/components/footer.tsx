"use client"

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Shakham</h3>
            <p className="text-muted-foreground mb-4">
              Empowering learners worldwide with quality education and professional development opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/courses" className="text-muted-foreground hover:text-primary">
                  All Courses
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>123 Learning Street, Education City, 12345</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>info@shakham.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shakham. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
