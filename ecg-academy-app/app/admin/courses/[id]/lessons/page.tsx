import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DeleteLessonButton from "./delete-lesson-button";

export const instant = false;

export default async function AdminLessonsPage({
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
    include: {
      lessons: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/courses" className="text-cyan-400 hover:text-cyan-300">
          ← Управление курсами
        </Link>

        <p className="mt-8 text-sm uppercase tracking-[0.25em] text-cyan-400">
          ECG Academy · Admin
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Уроки курса</h1>
            <p className="mt-2 text-slate-400">{course.titleRu}</p>
            <p className="text-sm text-slate-500">{course.titleEn}</p>
          </div>

          <Link
            href={`/admin/courses/${course.id}/lessons/new`}
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            + Добавить урок
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Всего уроков</p>
          <p className="mt-2 text-3xl font-semibold">{course.lessons.length}</p>
        </div>

        <section className="mt-8 space-y-4">
          {course.lessons.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <h2 className="text-xl font-semibold">Уроков пока нет</h2>
              <p className="mt-3 text-slate-400">
                Добавь первый урок в этот курс.
              </p>
            </div>
          ) : (
            course.lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm text-cyan-400">
                  Урок №{lesson.position + 1}
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {lesson.titleRu}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {lesson.titleEn}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  {lesson.videoUrl ? "Видео добавлено" : "Видео пока не добавлено"}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                    className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                  >
                    Редактировать
                  </Link>

                  <DeleteLessonButton
                    courseId={course.id}
                    lessonId={lesson.id}
                  />
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}