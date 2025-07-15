"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase/client";
import Lottie from 'lottie-react';
import animationData from '../assets/login.json';

const Home = () => {
  const [highlightedCards, setHighlightedCards] = useState<number[]>([]);
  const [cardColors, setCardColors] = useState<string[]>([
    "bg-indigo-800", "bg-gray-800", "bg-purple-800", "bg-blue-900", 
    "bg-green-800", "bg-gray-600", "bg-indigo-800", "bg-purple-800", 
    "bg-gray-700"
  ]);
  const [previousHighlightedCards, setPreviousHighlightedCards] = useState<number[]>([]);
  const [showAuthForm, setShowAuthForm] = useState<"login" | "signup" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number | "">(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false); 
  const router = useRouter();

  const getRandomCards = useCallback(() => {
    const availableCards = Array.from({ length: 9 }, (_, index) => index).filter(
      (index) => !previousHighlightedCards.includes(index)
    );

    const randomCards = [];
    const selectedRows = new Set();

    while (randomCards.length < 3) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const card = availableCards[randomIndex];

      const row = Math.floor(card / 3);
      if (!selectedRows.has(row)) {
        randomCards.push(card);
        selectedRows.add(row);
      }

      availableCards.splice(randomIndex, 1);
    }

    return randomCards;
  }, [previousHighlightedCards]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCards = getRandomCards();

      setCardColors((prevColors) => {
        const newColors = [...prevColors];
        randomCards.forEach((cardIndex) => {
          newColors[cardIndex] = getRandomColor();
        });
        return newColors;
      });

      setHighlightedCards(randomCards);
      setPreviousHighlightedCards(randomCards);
    }, 2000);

    return () => clearInterval(interval);
  }, [getRandomCards]);

  const getRandomColor = () => {
    const colors = [
      "bg-gray-600", "bg-gray-800", "bg-purple-800", "bg-indigo-800", "bg-blue-900", "bg-green-800"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      console.log("User logged in:", user);
      router.push("/screens/home");
    } catch (err) {
      if (err instanceof Error) {
        setError("Error: " + err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, gender, age }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);

        setShowAuthForm("login");
        setEmail("");
        setPassword("");
        setName("");
        setGender("");
        setAge("");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      setError("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/9665239/9665239-uhd_2732_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute top-0 left-0 w-3/5 h-[100%] grid grid-cols-3 gap-4 p-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 border-gray-500 shadow-lg text-white w-full max-w-xs transition-all duration-300 ease-in-out transform ${highlightedCards.includes(index) ? "scale-105" : "scale-90"} hover:scale-105 ${cardColors[index]} hover:border-blue-500`}
          >
            <h2
              className={`text-lg font-semibold transition-all duration-300 ease-in-out ${highlightedCards.includes(index) ? "text-2xl" : "text-lg"}`}
            >
              Question {index + 1}
            </h2>
            <p className="text-gray-300">
              This is a description of question {index + 1}. You can add more details here.
            </p>
          </div>
        ))}
      </div>

      <div className="absolute top-0 right-0 w-2/5 h-[100%] p-8 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out">
        <div className={`w-full max-w-xl h-[80%] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-800 p-8 rounded-lg shadow-lg transform transition-all duration-1000 ${flipped ? "rotate-y-180" : ""}`}>
          {!flipped && (
            <div>
              <h2 className="text-3xl font-bold text-center jus text-white mb-4">Welcome to Our Platform</h2>
              <p className="text-white text-center mb-4">Please sign in or sign up to get started!</p>
              <Lottie 
                animationData={animationData} 
                loop={true} 
                className="w-[90%] h-[40%] mb-8 justify-center mx-auto"
              />
              <div className="flex justify-around">
                <button
                  onClick={() => { setFlipped(true); setShowAuthForm("signup"); }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-l focus:outline-none"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => { setFlipped(true); setShowAuthForm("login"); }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-l focus:outline-none"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {flipped && (
            <div className="transition-all duration-1000 transform rotate-y-180 relative">
              
              <button
                onClick={() => setFlipped(false)}
                className="top-4 left-4 text-white text-lg bg-transparent border-2 border-white rounded-full px-6 py-2 transition-all duration-300 hover:bg-white hover:text-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                style={{ zIndex: 10 }}
              >
                Back
              </button>

              {showAuthForm === "login" && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-center mb-4 text-white">Login</h2>
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                  </form>
                </div>
              )}

              {showAuthForm === "signup" && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign Up</h2>
                  <form onSubmit={handleSignupSubmit} className="space-y-6">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      required
                    />
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label className="block text-white mb-2">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-white mb-2">Age</label>
                        <input
                          type="number"
                          placeholder="Age"
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                          min={0}
                          max={100}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      disabled={loading}
                    >
                      {loading ? "Signing up..." : "Sign Up"}
                    </button>
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
