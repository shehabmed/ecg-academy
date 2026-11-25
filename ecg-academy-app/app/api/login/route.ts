import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { z } from "zod";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(64),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Введите корректный email и пароль." },
        { status: 400 }
      );
    }

    const email = result.data.email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await compare(result.data.password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Неверный email или пароль." },
        { status: 401 }
      );
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("ecg_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({
      message: "Вход выполнен успешно.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Не удалось выполнить вход." },
      { status: 500 }
    );
  }
}
