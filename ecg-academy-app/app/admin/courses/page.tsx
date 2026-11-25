import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DeleteCourseButton from "./delete-course-button";

export const instant = false;

export default async function AdminCoursesPage() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          lessons: true,
          payments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300">
          ← Личный кабинет
        </Link>

        <p className="mt-8 text-sm uppercase tracking-[0.25em] text-cyan-400">
          ECG Academy · Admin
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Управление курсами</h1>
            <p className="mt-2 text-slate-400">
              Создавай курсы, устанавливай цены и управляй публикацией.
            </p>
          </div>

          <Link
            href="/admin/courses/new"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            + Добавить курс
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Всего курсов</p>
            <p className="mt-2 text-3xl font-semibold">{courses.length}</p>
          </div>

          <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
            <p className="text-sm text-slate-400">Опубликовано</p>
            <p className="mt-2 text-3xl font-semibold text-green-300">
              {courses.filter((course) => course.status === "PUBLISHED").length}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
            <p className="text-sm text-slate-400">Черновики</p>
            <p className="mt-2 text-3xl font-semibold text-yellow-300">
              {courses.filter((course) => course.status === "DRAFT").length}
            </p>
          </div>
        </div>

        <section className="mt-8 space-y-4">
          {courses.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              Курсов пока нет.
            </div>
          ) : (
            courses.map((course) => (
              <article
                key={course.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {course.titleRu}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {course.titleEn}
                    </p>
                    <p className="mt-3 text-sm text-slate-500">
                      Slug: {course.slug}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-semibold">
                      {course.isFree ? "Бесплатно" : `${course.price.toString()} ₽`}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {course.status === "PUBLISHED" ? "Опубликован" : "Черновик"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">
                  <span>Уроков: {course._count.lessons}</span>
                  <span>Заявок на оплату: {course._count.payments}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="inline-block rounded-xl border border-cyan-400/40 px-5 py-3 text-cyan-300 hover:bg-cyan-400/10"
                  >
                    Редактировать курс
                  </Link>
                  <Link
                    href={`/admin/courses/${course.id}/lessons`}
                    className="inline-block rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
                  >
                    Управление уроками ({course._count.lessons})
                  </Link>
                  <DeleteCourseButton courseId={course.id} />
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
