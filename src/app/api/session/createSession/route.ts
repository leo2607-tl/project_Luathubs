import { NextResponse } from "next/server";
import { firestore } from "../../../firebase/client";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    const sessionId = `session-${new Date().getTime()}`;
    const sessionRef = doc(firestore, "sessions", sessionId);
    await setDoc(sessionRef, {
      user_id: userId,
      conversation: [],
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, { 
      
    });

    return NextResponse.json({ message: "Session created successfully!" });
  } catch (error) {
    console.error("Error creating session: ", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
