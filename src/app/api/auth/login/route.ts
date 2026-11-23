import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const validEmail = (process.env.ADMIN_EMAIL || "admin@stackwise.io").toLowerCase().trim();
    const validPassword = process.env.ADMIN_PASSWORD || "stackwise2025!";

    const inputEmail = (email || "").toLowerCase().trim();
    const inputPassword = password || "";

    // Verify credentials
    const isEmailValid = inputEmail === validEmail || inputEmail === "leonardo@stackwise.io";
    const isPasswordValid = inputPassword === validPassword;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos. Acesso restrito ao proprietário." },
        { status: 401 }
      );
    }

    // Generate signed cryptographic session token
    const token = await createSessionToken();

    // Set HTTP-only secure cookie
    const cookieStore = cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        email: inputEmail,
        role: "owner",
        name: "Proprietário STACKWISE",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro interno no servidor";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
