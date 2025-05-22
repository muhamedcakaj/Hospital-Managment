import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import axiosInstance from '../Axios/index';
import { SendHorizonal, MessageCircleMore } from "lucide-react";

const API_BASE = "http://localhost:8085";
const WS_BASE = "ws://localhost:8087/ws/chat";

export default function UserMessages({ loggedInUser }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const wsRef = useRef(null);
  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).sub;

  useEffect(() => {
    fetchDoctors();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      fetchMessages(selectedDoctorId);
      if (wsRef.current) wsRef.current.close();
      const ws = new WebSocket(`${WS_BASE}?userId=${userId}`);
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (
          (message.senderId === selectedDoctorId && message.receiverId === userId) ||
          (message.senderId === userId && message.receiverId === selectedDoctorId)
        ) {
          setChatMessages((prev) => [...prev, message]);
        }
      };
      wsRef.current = ws;
    }
  }, [selectedDoctorId]);

  const fetchDoctors = async () => {
    const res = await axios.get("http://localhost:8085/doctors/user");
    setDoctors(res.data);
  };

  const fetchConversations = async () => {
    const res = await axiosInstance.get(`${API_BASE}/chat/conversations/${userId}`);
    setConversations(res.data);
  };

  const fetchMessages = async (doctorId) => {
    const res = await axiosInstance.get(`${API_BASE}/chat/messages/${userId}/${doctorId}`);
    setChatMessages(res.data);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      senderId: userId,
      receiverId: selectedDoctorId,
      content: newMessage,
    };
    wsRef.current.send(JSON.stringify(msg));
    setChatMessages((prev) => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
    setNewMessage("");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MessageCircleMore className="text-blue-500" /> Chat with a Doctor
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Doctor selection dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Choose a doctor:</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Select a doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.first_name} {doc.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Conversations</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {conversations.map((conv) => {
            const docId = conv.userId1 === userId ? conv.userId2 : conv.userId1;
            const status = conv.lastSenderId === userId ? "Delivered" : "New Message";
            const statusColor = status === "Delivered" ? "text-green-600" : "text-blue-600";
            return (
              <div
                key={conv.id}
                className="flex items-center justify-between bg-white shadow-sm border rounded-lg p-3 hover:shadow-md transition"
              >
                <div>
                  <div className="font-medium text-gray-800">Doctor ID: {docId}</div>
                  <div className={`text-xs ${statusColor}`}>{status}</div>
                </div>
                <button
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700"
                  onClick={() => setSelectedDoctorId(docId)}
                >
                  Chat
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Box */}
      {selectedDoctorId && (
        <div className="mt-6 border rounded-lg shadow-lg bg-white">
          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-2 bg-gray-50 border-b">
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={`px-4 py-2 max-w-[70%] rounded-lg shadow text-sm ${
                  m.senderId === userId
                    ? "bg-blue-500 text-white ml-auto text-right"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center p-4 gap-2 bg-white">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 ring-blue-300"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 flex items-center gap-1"
            >
              <SendHorizonal size={16} />
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}