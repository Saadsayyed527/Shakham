import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageSquare, Send, ThumbsUp, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  hasLiked: boolean;
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  courseId: string;
  nextLectureId?: string;
  prevLectureId?: string;
}

const VideoPlayer: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock data - In a real app, this would come from an API
  const [lecture, setLecture] = useState<Lecture>({
    id: "l1",
    title: "Introduction to Web Development",
    description: "This lecture introduces the fundamentals of web development and what you'll learn throughout the course.",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    courseId: "1",
    nextLectureId: "l2",
    prevLectureId: undefined,
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      user: {
        id: "u1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "This was really helpful! I've been struggling with understanding how the web works, but this explanation made it clear.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      likes: 5,
      hasLiked: false,
    },
    {
      id: "c2",
      user: {
        id: "u2",
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Could you explain more about HTTP protocols in the next lecture? I'm still a bit confused about that part.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      likes: 2,
      hasLiked: true,
    },
  ]);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      const newComment: Comment = {
        id: `c${comments.length + 1}`,
        user: {
          id: "current-user",
          name: "You",
          avatar: undefined,
        },
        content: comment,
        createdAt: new Date(),
        likes: 0,
        hasLiked: false,
      };

      setComments([newComment, ...comments]);
      setComment("");
      setIsLoading(false);
      alert("Comment added successfully");
    }, 1000);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
              hasLiked: !c.hasLiked,
            }
          : c
      )
    );
  };

  const navigateToLecture = (lectureId?: string) => {
    if (!lectureId) return;
    navigate(`/video/${lecture.courseId}/${lectureId}`);
  };

  const handleVideoEnded = () => {
    alert("Lecture completed");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold md:text-2xl truncate">{lecture.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <video
                ref={videoRef}
                src={lecture.videoUrl}
                controls
                className="w-full h-full object-cover"
                onEnded={handleVideoEnded}
              />
            </Card>
          </div>

          <div>
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="comments">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                    <CardDescription>Share your thoughts about this lecture.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleAddComment} disabled={!comment.trim() || isLoading}>
                      {isLoading ? "Posting..." : "Post Comment"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>

                    <Separator className="my-6" />

                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4">
                        <Avatar>
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{comment.user.name}</p>
                          <span>
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                          </span>
                          <p>{comment.content}</p>
                          <Button onClick={() => handleLikeComment(comment.id)}>
                            <ThumbsUp className={`h-4 w-4 ${comment.hasLiked ? "fill-primary" : ""}`} />
                            {comment.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
