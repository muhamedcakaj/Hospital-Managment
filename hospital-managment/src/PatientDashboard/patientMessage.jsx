import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import axiosInstance from '../Axios/index';

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
    const msg = {
      senderId: userId,
      receiverId: selectedDoctorId,
      content: newMessage,
    };
    wsRef.current.send(JSON.stringify(msg));
    setNewMessage("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chat with a Doctor</h2>

      <select
        className="border px-2 py-1 mb-4"
        onChange={(e) => setSelectedDoctorId(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select a doctor</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.first_name} {doc.last_name}
          </option>
        ))}
      </select>

      <div className="space-y-2 mb-4">
        <h3 className="text-lg font-medium">Your conversations</h3>
        {conversations.map((conv) => {
          const docId = conv.userId1 === userId ? conv.userId2 : conv.userId1;
          return (
            <div key={conv.id} className="flex justify-between items-center border-b py-2">
              <span>Doctor ID: {docId}</span>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => setSelectedDoctorId(docId)}
              >
                Chat
              </button>
            </div>
          );
        })}
      </div>

      {selectedDoctorId && (
        <div className="mt-4 border-t pt-4">
          <div className="h-64 overflow-y-auto border p-2 bg-gray-50 mb-2">
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={`mb-1 px-2 py-1 rounded ${
                  m.senderId === userId
                    ? "bg-green-100 text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              className="flex-1 border px-2 py-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-1 ml-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}