import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const paymentSchema = z.object({
  courseSlug: z.string().min(1).max(150),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Сначала войдите в аккаунт." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = paymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Некорректный запрос." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: {
        slug: result.data.courseSlug,
        status: "PUBLISHED",
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Курс не найден." },
        { status: 404 }
      );
    }

    if (course.isFree || Number(course.price) <= 0) {
      return NextResponse.json(
        { error: "Этот курс бесплатный." },
        { status: 400 }
      );
    }

    const existingAccess = await prisma.courseAccess.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingAccess) {
      return NextResponse.json(
        { error: "У вас уже есть доступ к этому курсу." },
        { status: 409 }
      );
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        status: "PENDING",
      },
    });

    if (existingPayment) {
      return NextResponse.json({
        message: "Заявка на оплату уже существует.",
        payment: {
          id: existingPayment.id,
          amount: existingPayment.amount.toString(),
          status: existingPayment.status,
        },
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        amount: course.price,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Заявка на оплату создана.",
        payment: {
          id: payment.id,
          amount: payment.amount.toString(),
          status: payment.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment request error:", error);

    return NextResponse.json(
      { error: "Не удалось создать заявку на оплату." },
      { status: 500 }
    );
  }
}
