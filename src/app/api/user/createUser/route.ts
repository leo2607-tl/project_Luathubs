import { NextResponse } from "next/server";
import { auth, firestore } from "../../../firebase/client";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  const { email, password, name, gender, age} = await req.json();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(firestore, "users", user.uid);

    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: name,
      gender: gender,
      age: age,
      token_per_day: 3000, 
      isDisable: false,
      isVIP: false,
      isOnline: true,
      total_money: 0, 
    });

    await sendEmailVerification(user);

    return NextResponse.json({ message: "User created and verification email sent!" });
  } catch (error) {
    console.error("Error creating user: ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
