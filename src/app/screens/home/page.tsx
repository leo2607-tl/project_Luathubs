"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/screens/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-semibold text-blue-600">
        Welcome, {user ? user.email : "Guest"}
      </h1>
      <p className="mt-2 text-lg text-gray-700">You're logged in!</p>
      {user && (
        <button
          onClick={() => auth.signOut()}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Home;
