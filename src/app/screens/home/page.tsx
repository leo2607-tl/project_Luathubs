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
        router.push("/login"); 
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  return (
    <div>
      <h1>Welcome, {user ? user.email : "Guest"}</h1>
      <p>You're logged in!</p>
      {user && <button onClick={() => auth.signOut()}>Logout</button>}
    </div>
  );
};

export default Home;
