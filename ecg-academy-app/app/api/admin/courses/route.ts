import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const courseSchema = z.object({
  titleRu: z.string().trim().min(2).max(200),
  titleEn: z.string().trim().min(2).max(200),
  descriptionRu: z.string().max(10000).optional(),
  descriptionEn: z.string().max(10000).optional(),
  isFree: z.boolean(),
  price: z.number().nonnegative(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function POST(request: Request) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = courseSchema.safeParse(body);

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

  const baseSlug = data.titleEn
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const slug = baseSlug || `course-${Date.now()}`;

  const existing = await prisma.course.findUnique({ where: { slug } });

  if (existing) {
    return NextResponse.json({ error: "Курс с таким названием уже существует. Измените английское название." }, { status: 409 });
  }

  const course = await prisma.course.create({
    data: {
      ...data,
      price: data.isFree ? 0 : data.price,
      slug,
      descriptionRu: data.descriptionRu || null,
      descriptionEn: data.descriptionEn || null,
    },
  });

  return NextResponse.json({ success: true, courseId: course.id });
}
