import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();
  const posts = await db.collection("communities").find({}).sort({ date: -1 }).toArray();
  return NextResponse.json(posts);
} 