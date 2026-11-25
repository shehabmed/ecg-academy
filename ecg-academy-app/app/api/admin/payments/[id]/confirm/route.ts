import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const instant = false;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Доступ запрещён." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Заявка не найдена." },
        { status: 404 }
      );
    }

    if (payment.status === "CONFIRMED") {
      return NextResponse.json({
        message: "Оплата уже подтверждена.",
      });
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json(
        { error: "Эту заявку нельзя подтвердить." },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
        },
      });

      await tx.courseAccess.upsert({
        where: {
          userId_courseId: {
            userId: payment.userId,
            courseId: payment.courseId,
          },
        },
        update: {},
        create: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
      });
    });

    return NextResponse.json({
      message: "Оплата подтверждена. Доступ к курсу открыт.",
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);

    return NextResponse.json(
      { error: "Не удалось подтвердить оплату." },
      { status: 500 }
    );
  }
}
