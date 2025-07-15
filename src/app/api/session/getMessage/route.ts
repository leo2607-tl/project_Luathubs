import { NextResponse } from 'next/server';
import { firestore } from "../../../firebase/client";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const sessionRef = doc(firestore, "sessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const sessionData = sessionSnap.data();
    const messages = sessionData?.conversation || [];

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error retrieving session messages: ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
