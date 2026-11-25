import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const lessonSchema = z.object({
  titleRu: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  contentRu: z.string().max(50000).optional().default(""),
  contentEn: z.string().max(50000).optional().default(""),
  videoUrl: z.string().max(500).optional().default(""),
  position: z.number().int().min(0).max(10000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Доступ запрещён" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) {
    return NextResponse.json(
      { error: "Курс не найден" },
      { status: 404 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  const parsed = lessonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверь поля урока" },
      { status: 400 }
    );
  }

  const videoKey = parsed.data.videoUrl.trim();

  if (
    videoKey &&
    !/^lessons\/[0-9a-f-]+\.mp4$/i.test(videoKey)
  ) {
    return NextResponse.json(
      { error: "Некорректный ключ видео" },
      { status: 400 }
    );
  }

  const lesson = await prisma.lesson.create({
    data: {
      courseId: id,
      titleRu: parsed.data.titleRu,
      titleEn: parsed.data.titleEn,
      contentRu: parsed.data.contentRu,
      contentEn: parsed.data.contentEn,
      videoUrl: videoKey || null,
      position: parsed.data.position,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}