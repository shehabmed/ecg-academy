import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ecg_session")?.value;

    if (token) {
      const tokenHash = createHash("sha256").update(token).digest("hex");

      await prisma.session.deleteMany({
        where: { tokenHash },
      });
    }

    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));

    response.cookies.set("ecg_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Не удалось выйти из аккаунта." },
      { status: 500 }
    );
  }
}
