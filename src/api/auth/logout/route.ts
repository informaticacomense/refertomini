import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout effettuato" });
  response.headers.append("Set-Cookie", "refertimini_token=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0");
  return response;
}
