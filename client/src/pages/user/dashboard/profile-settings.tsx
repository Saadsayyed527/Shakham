"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Key, Save } from "lucide-react"

interface ProfileSettingsProps {
  instructorData: any
  setInstructorData: React.Dispatch<React.SetStateAction<any>>
}

export function ProfileSettings({ instructorData, setInstructorData }: ProfileSettingsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("name", instructorData.name)
      formData.append("email", instructorData.email)
      formData.append("bio", instructorData.bio || "")
      if (profileImage) formData.append("profileImage", profileImage)

      const response = await fetch("/api/instructor/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to update profile")

      const updatedData = await response.json()
      setInstructorData(updatedData)

      toast({ title: "Success", description: "Profile updated successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Tabs defaultValue="profile" className="w-full">
        {/* Tabs List */}
        <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={instructorData?.profileImage || "/placeholder-user.jpg"} />
                    <AvatarFallback>{instructorData?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="w-full md:w-auto">
                    <Label htmlFor="profile-image">Profile Image</Label>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={instructorData?.name || ""}
                      onChange={(e) =>
                        setInstructorData({ ...instructorData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={instructorData?.email || ""}
                      onChange={(e) =>
                        setInstructorData({ ...instructorData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={instructorData?.bio || ""}
                    onChange={(e) =>
                      setInstructorData({ ...instructorData, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <Save className="mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
