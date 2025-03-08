import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    price: 0,
    category: "",
    title: "",
    description: "",
    courseId: "",
    file: null as File | null,
  });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/instructor/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data);
    } catch (error) {
      toast.error("Error fetching videos");
    }
  };

  const handleFileChange = (e) => {
    setNewVideo({ ...newVideo, file: e.target.files[0] });
  };

  const handleAddVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("price", newVideo.price.toString());
      formData.append("category", newVideo.category);
      formData.append("title", newVideo.title);
      formData.append("description", newVideo.description);
      formData.append("courseId", newVideo.courseId);
      if (newVideo.file) formData.append("file", newVideo.file);
    


      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) alert("Error adding video");
      toast.success("Course added successfully!");
      fetchVideos();

      setNewVideo({
        price: 0,
        category: "",
        title: "",
        description: "",
        courseId: "",
        file: null,
      });

      toast.success("Video added successfully!");
    } catch (error) {
      toast.error("Error adding video");
    }
  };

  const handleUpdateVideo = async () => {
    if (!selectedVideo) return;
    try {
      await axios.put(
        `http://localhost:5000/api/instructor/videos/${selectedVideo.id}`,
        { price: selectedVideo.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Video updated successfully!");
      fetchVideos();
      setSelectedVideo(null);
    } catch (error) {
      toast.error("Error updating video");
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/instructor/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Video deleted successfully!");
      fetchVideos();
    } catch (error) {
      toast.error("Error deleting video");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Videos</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Title"
          value={newVideo.title}
          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Description"
          value={newVideo.description}
          onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={newVideo.price}
          onChange={(e) => setNewVideo({ ...newVideo, price: Number(e.target.value) })}
        />
        <Select onValueChange={(value) => setNewVideo({ ...newVideo, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
        <Input type="file" ref={fileInputRef} onChange={handleFileChange} />
        <Button onClick={handleAddVideo}>Add Video</Button>
      </div>

      <h3 className="text-lg font-semibold mt-6">Video List</h3>
      <ul>
        {videos.map((video) => (
          <li key={video.id} className="flex justify-between items-center border p-2 my-2">
            <span>{video.title} - ${video.price}</span>
            <div>
              <Button onClick={() => setSelectedVideo(video)}>Edit</Button>
              <Button className="ml-2" onClick={() => handleDeleteVideo(video.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {selectedVideo && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Edit Video</h3>
          <Input
            type="number"
            placeholder="Price"
            value={selectedVideo.price}
            onChange={(e) =>
              setSelectedVideo((prev) => ({ ...prev, price: Number(e.target.value) }))
            }
          />
          <Button onClick={handleUpdateVideo}>Update</Button>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default VideoManagement;
