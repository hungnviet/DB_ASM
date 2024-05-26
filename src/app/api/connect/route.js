import createDbConnection from "@/config/dg";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  const { name, password } = data;
  console.log(data);
  try {
    const db = await createDbConnection(name, password);
    return new NextResponse(200, {
      message: "Connected to database successfully!",
    });
  } catch (error) {
    console.log(`Connected to database fail as user ${name}!`);
    return new NextResponse(500, { message: "Failed to connect to database!" });
  }
}
