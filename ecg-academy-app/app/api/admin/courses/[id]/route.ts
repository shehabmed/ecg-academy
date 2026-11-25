import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const schema = z.object({
  titleRu: z.string().trim().min(2).max(200),
  titleEn: z.string().trim().min(2).max(200),
  descriptionRu: z.string().max(10000),
  descriptionEn: z.string().max(10000),
  isFree: z.boolean(),
  price: z.number().nonnegative(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Проверьте заполненные поля" }, { status: 400 });
  }

  const data = parsed.data;

  if (data.isFree && data.price !== 0) {
    return NextResponse.json({ error: "У бесплатного курса цена должна быть 0" }, { status: 400 });
  }

  if (!data.isFree && data.price <= 0) {
    return NextResponse.json({ error: "Укажите цену платного курса" }, { status: 400 });
  }

  const existing = await prisma.course.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
  }

  const course = await prisma.course.update({
    where: { id },
    data: {
      titleRu: data.titleRu,
      titleEn: data.titleEn,
      descriptionRu: data.descriptionRu || null,
      descriptionEn: data.descriptionEn || null,
      isFree: data.isFree,
      price: data.isFree ? 0 : data.price,
      status: data.status,
    },
  });

  return NextResponse.json({ success: true, courseId: course.id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          payments: true,
          access: true,
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
  }

  if (course._count.payments > 0 || course._count.access > 0) {
    return NextResponse.json(
      { error: "Нельзя удалить курс: по нему уже есть платежи или доступы. Смените статус на черновик." },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.lesson.deleteMany({ where: { courseId: id } });
    await tx.course.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}
