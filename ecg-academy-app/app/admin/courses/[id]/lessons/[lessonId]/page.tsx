import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EditLessonForm from "./edit-lesson-form";

export const instant = false;

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    redirect("/login");
  }

  const { id, lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId: id },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Редактировать урок</h1>
        <p className="mt-2 text-slate-400">
          Измени название, учебный материал, видео или номер урока.
        </p>
        <EditLessonForm
          courseId={id}
          lesson={{
            id: lesson.id,
            titleRu: lesson.titleRu,
            titleEn: lesson.titleEn,
            contentRu: lesson.contentRu ?? "",
            contentEn: lesson.contentEn ?? "",
            videoUrl: lesson.videoUrl ?? "",
            position: lesson.position,
          }}
        />
      </div>
    </main>
  );
}