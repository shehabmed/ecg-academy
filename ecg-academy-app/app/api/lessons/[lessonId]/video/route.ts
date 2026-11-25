import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { s3, storageBucket } from "@/lib/storage";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Необходимо войти в аккаунт" },
      { status: 401 }
    );
  }

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      videoUrl: true,
      courseId: true,
    },
  });

  if (!lesson || !lesson.videoUrl) {
    return NextResponse.json(
      { error: "Видео не найдено" },
      { status: 404 }
    );
  }

  const course = await prisma.course.findUnique({
    where: { id: lesson.courseId },
    select: {
      isFree: true,
      price: true,
      status: true,
    },
  });

  if (!course || course.status !== "PUBLISHED") {
    return NextResponse.json(
      { error: "Курс недоступен" },
      { status: 404 }
    );
  }

  const isFree = course.isFree || Number(course.price) <= 0;

  if (!isFree) {
    const access = await prisma.courseAccess.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.courseId,
        },
      },
    });

    if (!access) {
      return NextResponse.json(
        { error: "Нет доступа к этому курсу" },
        { status: 403 }
      );
    }
  }

  if (!/^lessons\/[0-9a-f-]+\.mp4$/i.test(lesson.videoUrl)) {
    return NextResponse.json(
      { error: "Некорректный ключ видео" },
      { status: 400 }
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: storageBucket,
      Key: lesson.videoUrl,
    });

    const videoUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    return NextResponse.json({ videoUrl });
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить видео" },
      { status: 500 }
    );
  }
}