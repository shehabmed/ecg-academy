import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Нет доступа." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Заявка не найдена." },
        { status: 404 }
      );
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json(
        { error: "Эта заявка уже обработана." },
        { status: 409 }
      );
    }

    const result = await prisma.payment.updateMany({
      where: {
        id,
        status: "PENDING",
      },
      data: {
        status: "REJECTED",
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Заявка уже была обработана." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      message: "Заявка отклонена. Доступ к курсу не предоставлен.",
    });
  } catch (error) {
    console.error("Payment rejection error:", error);

    return NextResponse.json(
      { error: "Не удалось отклонить заявку." },
      { status: 500 }
    );
  }
}
