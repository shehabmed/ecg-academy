import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      access: {
        where: { userId: user.id },
      },
      lessons: {
        select: {
          id: true,
          progress: {
            where: { userId: user.id, completed: true },
            select: { id: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enrolledCourses = courses.filter(
    (course) => course.isFree || course.access.length > 0
  );

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 pb-6">
        <Link href="/" className="text-xl font-bold">
          ECG<span className="text-cyan-400">Academy</span>
        </Link>

        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            Выйти
          </button>
        </form>
      </header>

      <div className="mx-auto max-w-6xl py-12">
        <section className="mb-12">
          <p className="mb-3 text-sm font-medium text-cyan-400">
            ЛИЧНЫЙ КАБИНЕТ
          </p>
          <h1 className="text-4xl font-bold">
            Добро пожаловать, {user.name}
          </h1>
          <p className="mt-3 text-slate-400">{user.email}</p>
        </section>

        {user.role === "ADMIN" && (
          <section className="mb-12 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-6">
            <p className="mb-4 text-sm font-medium text-cyan-400">
              ПАНЕЛЬ АДМИНИСТРАТОРА
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/courses"
                className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300"
              >
                Управление курсами
              </Link>
              <Link
                href="/admin/payments"
                className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Проверка оплат
              </Link>
            </div>
          </section>
        )}

        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Мои курсы</p>
            <p className="mt-3 text-3xl font-bold">{enrolledCourses.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Доступные курсы</p>
            <p className="mt-3 text-3xl font-bold">{courses.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Статус аккаунта</p>
            <p className="mt-3 text-xl font-semibold text-cyan-400">
              {user.role === "ADMIN" ? "Администратор" : "Студент"}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Моё обучение</h2>
            <Link
              href="/courses"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Все курсы →
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <h3 className="text-xl font-semibold">
                Вы ещё не записаны на курсы
              </h3>
              <p className="mt-3 text-slate-400">
                Выберите курс, чтобы начать изучение ЭКГ.
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-cyan-300"
              >
                Посмотреть курсы
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {enrolledCourses.map((course) => {
                const totalLessons = course.lessons.length;
                const completedLessons = course.lessons.filter(
                  (lesson) => lesson.progress.length > 0
                ).length;
                const progress = totalLessons
                  ? Math.round((completedLessons / totalLessons) * 100)
                  : 0;

                return (
                  <article
                    key={course.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                  >
                    <h3 className="text-xl font-semibold">{course.titleRu}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {course.titleEn}
                    </p>

                    <div className="mt-6 flex justify-between text-sm">
                      <span className="text-slate-400">Прогресс</span>
                      <span className="text-cyan-400">{progress}%</span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      {completedLessons} из {totalLessons} уроков завершено
                    </p>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="mt-6 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Перейти к курсу →
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
