import { NextResponse } from "next/server";
import { auth } from "../../firebase/client"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json(); 

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return NextResponse.json({ message: "User registered successfully", user: { email: user.email, uid: user.uid } });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function GET() {
  try {
    const currentUser: User | null = auth.currentUser;

    if (currentUser) {
      return NextResponse.json({ message: "User is logged in", user: { email: currentUser.email, uid: currentUser.uid } });
    } else {
      return NextResponse.json({ message: "No user is logged in" }, { status: 400 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
