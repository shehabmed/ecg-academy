import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const instant = false;

export default async function CoursesPage() {
  const [courses, user] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    }),
    getCurrentUser(),
  ]);

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 pb-6">
        <Link href="/" className="text-xl font-bold">
          ECG<span className="text-cyan-400">Academy</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-slate-300">
          <Link href="/" className="hover:text-cyan-400">Главная</Link>
          {user ? (
            <Link href="/dashboard" className="hover:text-cyan-400">
              Личный кабинет
            </Link>
          ) : (
            <Link href="/login" className="hover:text-cyan-400">
              Войти
            </Link>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl py-16">
        <p className="mb-4 text-sm font-semibold tracking-[0.25em] text-cyan-400">
          ECG ACADEMY · EDUCATION
        </p>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Изучай ЭКГ.
          <span className="block text-cyan-400">
            Понимай каждый сердечный ритм.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Практические образовательные курсы по электрокардиографии.
          От базовых принципов до уверенной интерпретации ЭКГ.
        </p>

        <div className="mt-12 flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <h2 className="text-2xl font-bold">Наши курсы</h2>
            <p className="mt-2 text-sm text-slate-400">
              Обучение на русском и английском языках
            </p>
          </div>
          <span className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-400">
            {courses.length} курсов
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl text-cyan-400">
              ECG
            </div>
            <h3 className="mt-6 text-2xl font-semibold">
              Курсы скоро появятся
            </h3>
            <p className="mx-auto mt-3 max-w-md text-slate-400">
              Мы готовим учебные материалы, видеоуроки и практические задания.
              Скоро здесь появится первый курс ECG Academy.
            </p>
            <Link
              href={user ? "/dashboard" : "/register"}
              className="mt-8 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300"
            >
              {user ? "В личный кабинет" : "Создать аккаунт"}
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-cyan-400/40"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-cyan-950 via-[#102b43] to-[#07111f]">
                  <div className="text-5xl font-light tracking-widest text-cyan-300">
                    ECG
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400">
                      ECG COURSE
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                      {course.isFree ? "Бесплатно" : "Платный курс"}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">
                    {course.titleRu}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {course.titleEn}
                  </p>

                  {course.descriptionRu && (
                    <p className="mt-4 leading-7 text-slate-400">
                      {course.descriptionRu}
                    </p>
                  )}

                  <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs text-slate-500">Стоимость</p>
                      <p className="mt-1 text-xl font-bold text-white">
                        {course.isFree
                          ? "Бесплатно"
                          : `${Number(course.price).toLocaleString("ru-RU")} ₽`}
                      </p>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ECG Academy. Learn Every Heartbeat.
      </footer>
    </main>
  );
}
