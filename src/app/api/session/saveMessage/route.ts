import { NextResponse } from 'next/server';
import { firestore } from "../../../firebase/client";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { sessionId, sender, message } = await req.json();

  try {
    const sessionRef = doc(firestore, "sessions", sessionId);

    await updateDoc(sessionRef, {
      conversation: arrayUnion({
        sender: sender,
        message: message,
        timestamp: Timestamp.now(),
      }),
      updated_at: Timestamp.now(),
    });

    return NextResponse.json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Error saving message: ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
