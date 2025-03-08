"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Grade {
  id: string
  assignmentTitle: string
  grade: string
  percentage: number
  feedback: {
    text: string
    audioUrl?: string
    videoUrl?: string
  }
}

const grades: Grade[] = [
  {
    id: "1",
    assignmentTitle: "Mathematics Problem Set 1",
    grade: "A",
    percentage: 92,
    feedback: {
      text: "Excellent work on the calculus problems. Your step-by-step solutions were clear and well-organized. For problem 3, consider using the chain rule more explicitly to make your solution even clearer. Overall, you've demonstrated a strong understanding of the concepts.",
      audioUrl: "#",
    },
  },
  {
    id: "2",
    assignmentTitle: "Physics Lab Report",
    grade: "B+",
    percentage: 87,
    feedback: {
      text: "Your lab report was well-structured with good analysis of the experimental data. The graphs were properly labeled and your conclusions were supported by the data. To improve, make sure to discuss potential sources of error more thoroughly and how they might have affected your results.",
      videoUrl: "#",
    },
  },
  {
    id: "3",
    assignmentTitle: "Literature Essay",
    grade: "A-",
    percentage: 90,
    feedback: {
      text: "Your analysis of the themes in the novel was insightful and well-supported with textual evidence. Your writing is clear and engaging. To reach the next level, try to connect the author's techniques more explicitly to the historical context of the work.",
    },
  },
  {
    id: "4",
    assignmentTitle: "Computer Science Project",
    grade: "C",
    percentage: 75,
    feedback: {
      text: "Your project met the basic requirements but lacked some of the more advanced features discussed in class. The code was functional but could be more efficient and better documented. I recommend reviewing the section on optimization algorithms and adding comments to explain your logic.",
      audioUrl: "#",
    },
  },
  {
    id: "5",
    assignmentTitle: "History Research Paper",
    grade: "B",
    percentage: 85,
    feedback: {
      text: "Your research paper showed good understanding of the historical period and events. Your arguments were logical and supported by credible sources. To improve, consider incorporating more primary sources and developing a stronger thesis that connects to broader historical trends.",
      videoUrl: "#",
    },
  },
]

interface GradesTableProps {
  limit?: number
}

export function GradesTable({ limit }: GradesTableProps) {
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)

  const displayedGrades = limit ? grades.slice(0, limit) : grades

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800"
    if (percentage >= 80) return "bg-blue-100 text-blue-800"
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment</TableHead>
              <TableHead className="hidden md:table-cell">Grade</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedGrades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{grade.assignmentTitle}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Badge className={getGradeColor(grade.percentage)}>{grade.grade}</Badge>
                    <span>{grade.percentage}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedGrade(grade)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">View Feedback</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Feedback: {selectedGrade?.assignmentTitle}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className={selectedGrade ? getGradeColor(selectedGrade.percentage) : ""}>
                            {selectedGrade?.grade}
                          </Badge>
                          <span>{selectedGrade?.percentage}%</span>
                        </div>

                        <Tabs defaultValue="text" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="text">Text</TabsTrigger>
                            <TabsTrigger value="audio" disabled={!selectedGrade?.feedback.audioUrl}>
                              Audio
                            </TabsTrigger>
                            <TabsTrigger value="video" disabled={!selectedGrade?.feedback.videoUrl}>
                              Video
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="text" className="mt-4">
                            <div className="rounded-md bg-muted p-4">
                              <p>{selectedGrade?.feedback.text}</p>
                            </div>
                          </TabsContent>
                          <TabsContent value="audio" className="mt-4">
                            {selectedGrade?.feedback.audioUrl ? (
                              <div className="rounded-md bg-muted p-4">
                                <audio controls className="w-full">
                                  <source src={selectedGrade.feedback.audioUrl} type="audio/mpeg" />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>
                            ) : (
                              <p>No audio feedback available.</p>
                            )}
                          </TabsContent>
                          <TabsContent value="video" className="mt-4">
                            {selectedGrade?.feedback.videoUrl ? (
                              <div className="rounded-md bg-muted p-4">
                                <video controls className="w-full">
                                  <source src={selectedGrade.feedback.videoUrl} type="video/mp4" />
                                  Your browser does not support the video element.
                                </video>
                              </div>
                            ) : (
                              <p>No video feedback available.</p>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

