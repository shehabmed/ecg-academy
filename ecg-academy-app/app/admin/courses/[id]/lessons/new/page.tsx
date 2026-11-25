import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import NewLessonForm from "./new-lesson-form";

export const instant = false;

export default async function NewLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { _count: { select: { lessons: true } } },
  });

  if (!course) notFound();

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/admin/courses/${course.id}/lessons`}
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Назад к урокам
        </Link>

        <h1 className="mt-8 text-3xl font-bold">Добавить урок</h1>
        <p className="mt-2 text-slate-400">{course.titleRu}</p>

        <NewLessonForm
          courseId={course.id}
          initialPosition={course._count.lessons}
        />
      </div>
    </main>
  );
}