"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("./../");
      } else {
        setUser(currentUser);
        createSession(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const createSession = async (userId: string) => {
    try {
      const response = await fetch("/api/session/createSession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.message === "Session created successfully!") {
        fetchSessions(userId);
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const fetchSessions = async (userId: string) => {
    try {
      const response = await fetch(`/api/session/getSession?userId=${userId}`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleSessionSelect = async (sessionId: string) => {
    setSelectedSession(sessionId);
    try {
      const response = await fetch(`/api/session/getMessage?sessionId=${sessionId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage || !selectedSession) return;

    try {
      await fetch("/api/session/saveMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: selectedSession,
          sender: "user",
          message: newMessage,
        }),
      });

      await fetch("/api/session/saveMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: selectedSession,
          sender: "chatbot",
          message: "hi",
        }),
      });

      setNewMessage("");
      handleSessionSelect(selectedSession);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="w-1/4 bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Sessions</h2>
        <div className="mt-4">
          {!sessions.length ? (
            <button
              onClick={() => createSession(user?.uid || '')}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Create Session
            </button>
          ) : (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 text-lg">Your Sessions</h3>
              <ul>
                {sessions.map((sessionId) => (
                  <li
                    key={sessionId}
                    onClick={() => handleSessionSelect(sessionId)}
                    className="mt-3 cursor-pointer text-indigo-600 hover:text-indigo-800 transition duration-200"
                  >
                    {sessionId}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="w-3/4 bg-white p-6 rounded-lg shadow-xl ml-6 flex flex-col">
        {selectedSession && (
          <>
            <div className="flex-1 overflow-auto bg-gray-50 p-6 rounded-lg shadow-md mb-4">
              <div className="text-center text-xl font-semibold text-gray-800 mb-4">
                Chat {selectedSession}
              </div>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.sender === "user" ? "bg-indigo-200 text-indigo-800" : "bg-green-200 text-green-800"
                    }`}
                  >
                    <strong>{msg.sender === "user" ? "You:" : "Chatbot:"}</strong> {msg.message}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <textarea
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Send Message
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
