import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: google4504c07f45a6cd32.html", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
