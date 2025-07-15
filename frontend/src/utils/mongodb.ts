import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string; // .env에 MONGODB_URI 추가 필요
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env");
}

if (process.env.NODE_ENV === "development") {
  // 개발환경에서는 핫리로드 방지
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(); // 기본 DB 사용, 필요시 db("DB이름")으로 변경
  return { client, db };
} 