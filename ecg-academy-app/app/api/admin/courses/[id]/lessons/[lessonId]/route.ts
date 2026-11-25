import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const lessonSchema = z.object({
  titleRu: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  contentRu: z.string().max(50000).optional().default(""),
  contentEn: z.string().max(50000).optional().default(""),
  videoUrl: z.string().max(2000).optional().default(""),
  position: z.number().int().min(0).max(10000),
});

type RouteContext = {
  params: Promise<{ id: string; lessonId: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { id, lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId: id },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = lessonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Check lesson fields" }, { status: 400 });
  }

  const videoUrl = parsed.data.videoUrl.trim();

  if (videoUrl) {
    try {
      const url = new URL(videoUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
    }
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      titleRu: parsed.data.titleRu,
      titleEn: parsed.data.titleEn,
      contentRu: parsed.data.contentRu,
      contentEn: parsed.data.contentEn,
      videoUrl: videoUrl || null,
      position: parsed.data.position,
    },
  });

  return NextResponse.json({ lesson: updatedLesson });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { id, lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId: id },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  await prisma.lesson.delete({
    where: { id: lessonId },
  });

  return NextResponse.json({ success: true });
}