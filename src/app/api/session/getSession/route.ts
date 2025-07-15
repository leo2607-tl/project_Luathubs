import { NextResponse } from 'next/server';
import { firestore } from "../../../firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  console.log("Fetching sessions for user:", userId);
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const sessionsRef = collection(firestore, "sessions");
    const q = query(sessionsRef, where("user_id", "==", userId));

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => doc.id);

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions: ", error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
