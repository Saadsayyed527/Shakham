import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RoomPage() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (room.trim()) {
      navigate(`/chat/${room}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Join a Chat Room</h2>
      <input type="text" placeholder="Enter Room Name" className="border p-2 rounded w-64 mb-2"
        value={room} onChange={(e) => setRoom(e.target.value)} />
      <Button onClick={joinRoom} className=" text-white px-4 py-2 rounded">Join Room</Button>
    </div>
  );
}
