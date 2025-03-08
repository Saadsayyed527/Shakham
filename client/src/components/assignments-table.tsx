"use client"

import { useState } from "react"
import { Download, Upload, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Assignment {
  id: string
  title: string
  deadline: string
  fileUrl: string
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "Mathematics Problem Set 3",
    deadline: "2025-03-10",
    fileUrl: "#",
  },
  {
    id: "2",
    title: "Physics Lab Report",
    deadline: "2025-03-15",
    fileUrl: "#",
  },
  {
    id: "3",
    title: "Literature Essay",
    deadline: "2025-03-20",
    fileUrl: "#",
  },
  {
    id: "4",
    title: "Computer Science Project",
    deadline: "2025-03-25",
    fileUrl: "#",
  },
  {
    id: "5",
    title: "History Research Paper",
    deadline: "2025-04-01",
    fileUrl: "#",
  },
]

interface AssignmentsTableProps {
  limit?: number
}

export function AssignmentsTable({ limit }: AssignmentsTableProps) {
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const displayedAssignments = limit ? assignments.slice(0, limit) : assignments

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysRemaining = (dateString: string) => {
    const deadline = new Date(dateString)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignment Title</TableHead>
            <TableHead className="hidden md:table-cell">Deadline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedAssignments.map((assignment) => {
            const daysRemaining = getDaysRemaining(assignment.deadline)
            return (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{assignment.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(assignment.deadline)}</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        daysRemaining <= 3
                          ? "bg-red-100 text-red-800"
                          : daysRemaining <= 7
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {daysRemaining} days
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Upload</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Assignment Submission</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="assignment">Assignment</Label>
                            <Input id="assignment" value={assignment.title} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="file">Upload File</Label>
                            <Input id="file" type="file" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="comments">Comments (Optional)</Label>
                            <textarea
                              id="comments"
                              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Add any comments about your submission..."
                            />
                          </div>
                          <Button className="w-full">Submit Assignment</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

