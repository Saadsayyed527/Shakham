import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: string;
  text: string;
}

export default function ChatPage() {
  const { room } = useParams<{ room: string }>(); // Room ID from URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);
    
    newSocket.emit("joinRoom", room); // Join the room

    // Listen for new messages
    newSocket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.disconnect(); // Cleanup when unmounting
    };
  }, [room]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      const newMsg = { roomId: room, sender: "You", text: message };

      socket.emit("sendMessage", newMsg); // Send message to server
      setMessages((prev) => [...prev, newMsg]); // Update UI
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Chat Room: {room}</h2>
      <div className="border p-4 w-80 h-64 overflow-auto bg-white rounded shadow">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="border p-2 rounded w-64 mt-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
