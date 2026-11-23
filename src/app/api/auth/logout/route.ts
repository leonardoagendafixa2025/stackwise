import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Clear cookie immediately
    });

    return NextResponse.json({ success: true, message: "Sessão encerrada com sucesso." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao encerrar sessão";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
