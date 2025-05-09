import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../Axios/index";

const API_BASE = "http://localhost:8085";
const WS_BASE = "ws://localhost:8087/ws/chat";

export default function DoctorMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const wsRef = useRef(null);
  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split(".")[1])).sub;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
      if (wsRef.current) wsRef.current.close();
      const ws = new WebSocket(`${WS_BASE}?userId=${userId}`);
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (
          (message.senderId === selectedUserId && message.receiverId === userId) ||
          (message.senderId === userId && message.receiverId === selectedUserId)
        ) {
          setChatMessages((prev) => [...prev, message]);
        }
      };
      wsRef.current = ws;
    }
  }, [selectedUserId]);

  const fetchConversations = async () => {
    const res = await axiosInstance.get(`${API_BASE}/chat/conversations/${userId}`);
    setConversations(res.data);
  };

  const fetchMessages = async (userId1) => {
    const res = await axiosInstance.get(`${API_BASE}/chat/messages/${userId}/${userId1}`);
    setChatMessages(res.data);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      senderId: userId,
      receiverId: selectedUserId,
      content: newMessage,
    };
    wsRef.current.send(JSON.stringify(msg));
    setChatMessages((prev) => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[80vh] border rounded-lg shadow-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4 bg-white overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chats</h2>
        {conversations.length === 0 && (
          <p className="text-gray-500 italic">No conversations yet.</p>
        )}
        {conversations.map((conv) => {
          const otherUserId = conv.userId1 === userId ? conv.userId2 : conv.userId1;
          const isLastSender = conv.lastSenderId === userId;
          const status = isLastSender ? "Delivered" : "New Chat";
          const badgeColor = isLastSender ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700";

          return (
            <div
              key={conv.id}
              className={`flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                selectedUserId === otherUserId ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedUserId(otherUserId)}
            >
              <div>
                <div className="font-semibold text-gray-800">User: {otherUserId}</div>
                <div className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 ${badgeColor}`}>
                  {status}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Window */}
      <div className="w-2/3 p-4 flex flex-col bg-gray-50">
        {selectedUserId ? (
          <>
            <div className="font-semibold text-lg text-gray-800 border-b pb-2 mb-2">
              Chat with User {selectedUserId}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                    m.senderId === userId
                      ? "bg-green-100 self-end text-right ml-auto"
                      : "bg-white self-start text-left mr-auto border"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center">
              <input
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 my-auto">Select a conversation to start chatting</div>
        )}
      </div>
    </div>
  );
}