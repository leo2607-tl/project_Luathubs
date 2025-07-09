"use client";

import { useEffect, useState, useCallback } from "react"; 
import { useRouter } from "next/navigation";

const Home = () => {
  const [highlightedCards, setHighlightedCards] = useState<number[]>([]);
  const [cardColors, setCardColors] = useState<string[]>([
    "bg-indigo-800",
    "bg-gray-800",
    "bg-purple-800",
    "bg-blue-900",
    "bg-green-800",
    "bg-gray-600",
    "bg-indigo-800",
    "bg-purple-800",
    "bg-gray-700",
  ]);
  const [previousHighlightedCards, setPreviousHighlightedCards] = useState<number[]>([]);

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

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
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

      <div className="absolute top-0 left-0 w-3/5 h-[85%] grid grid-cols-3 gap-4 p-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg text-white w-full max-w-xs transition-all duration-300 ease-in-out transform ${
              highlightedCards.includes(index) ? "scale-105" : "scale-90"
            } hover:scale-105 ${cardColors[index]}`}
          >
            <h2
              className={`text-lg font-semibold transition-all duration-300 ease-in-out ${
                highlightedCards.includes(index) ? "text-2xl" : "text-lg"
              }`}
            >
              Question {index + 1}
            </h2>
            <p className="text-gray-300">
              This is a description of question {index + 1}. You can add more details here.
            </p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-3/5 h-[15%] p-4 bg-white-100 bg-opacity-80 backdrop-blur-lg flex items-center justify-center">
        <div className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden">
          <div className="animate-marquee">
            This is a small card with a running text. Stay with us and explore more! <br />
            The largest the card, the more information you can add. <br/>
            You can customize the content as per your needs. <br />
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-r from-black-100 to-blue-900 p-8 flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Our Site</h1>
          <p className="text-gray-300">Join us and start your journey today!</p>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleNavigation("/screens/signup")}
          >
            Sign Up
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleNavigation("/screens/login")}
          >
            Login
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;