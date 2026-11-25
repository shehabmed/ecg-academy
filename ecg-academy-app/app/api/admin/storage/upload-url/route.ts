import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { s3, storageBucket } from "@/lib/storage";


const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

export async function POST(request: Request) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Доступ запрещён" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    if (
      body.contentType !== "video/mp4" ||
      !Number.isInteger(body.size) ||
      body.size <= 0 ||
      body.size > MAX_VIDEO_SIZE
    ) {
      return NextResponse.json(
        { error: "Выберите MP4-файл размером не более 500 МБ" },
        { status: 400 }
      );
    }

    const key = `lessons/${randomUUID()}.mp4`;

    const command = new PutObjectCommand({
      Bucket: storageBucket,
      Key: key,
      ContentType: "video/mp4",
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 600,
    });

    return NextResponse.json({ uploadUrl, key });
  } catch {
    return NextResponse.json(
      { error: "Не удалось подготовить загрузку видео" },
      { status: 500 }
    );
  }
}