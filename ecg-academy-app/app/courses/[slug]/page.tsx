
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import PaymentInstructions from "./payment-instructions";
import VideoPlayer from "./video-player";
export const instant = false;

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await getCurrentUser();

  const course = await prisma.course.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
  });

  if (!course) {
    notFound();
  }

  const isFree = course.isFree || Number(course.price) <= 0;

  let hasAccess = isFree;
  let paymentStatus: string | null = null;

  if (user && !isFree) {
    const [access, payment] = await Promise.all([
      prisma.courseAccess.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      }),
      prisma.payment.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          status: true,
        },
      }),
    ]);

    hasAccess = Boolean(access);
    paymentStatus = payment?.status ?? null;
  }

  const lessons = hasAccess
    ? await prisma.lesson.findMany({
        where: {
          courseId: course.id,
        },
        orderBy: {
          position: "asc",
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/courses"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Все курсы
        </Link>

        <p className="mt-10 text-sm uppercase tracking-[0.2em] text-cyan-400">
          ECG Academy · Course
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          {course.titleRu}
        </h1>

        <p className="mt-2 text-lg text-slate-400">
          {course.titleEn}
        </p>

        <p className="mt-6 leading-8 text-slate-300">
          {course.descriptionRu}
        </p>

        {hasAccess ? (
          <section className="mt-10">
            <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-6">
              <p className="text-xl font-semibold text-green-300">
                Доступ к курсу открыт
              </p>
              <p className="mt-2 text-slate-300">
                Вы можете изучать уроки этого курса.
              </p>
            </div>

            <h2 className="mt-10 text-2xl font-bold">
              Уроки курса
            </h2>

            {lessons.length === 0 ? (
              <p className="mt-5 rounded-xl bg-white/5 p-5 text-slate-300">
                Уроки пока добавляются. Скоро они появятся здесь.
              </p>
            ) : (
              <div className="mt-5 space-y-5">
                {lessons.map((lesson, index) => (
                  <article
                    key={lesson.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                  >
                    <p className="text-sm text-cyan-400">
                      Урок {index + 1}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {lesson.titleRu}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {lesson.titleEn}
                    </p>

                    
                                   {lesson.videoUrl && (
                      <VideoPlayer lessonId={lesson.id} />
                    )}

     {lesson.contentRu && (
                      <div className="mt-5 whitespace-pre-wrap leading-8 text-slate-300">
                        {lesson.contentRu}
                      </div>
                    )}

                    {!lesson.contentRu && lesson.contentEn && (
                      <div className="mt-5 whitespace-pre-wrap leading-8 text-slate-300">
                        {lesson.contentEn}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : !user ? (
          <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6">
            <h2 className="text-xl font-semibold">
              Войдите в аккаунт
            </h2>
            <p className="mt-2 text-slate-300">
              Чтобы оплатить курс и получить доступ к урокам,
              сначала войдите в свой аккаунт.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
            >
              Войти
            </Link>
          </div>
        ) : paymentStatus === "PENDING" ? (
          <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6">
            <h2 className="text-xl font-semibold text-yellow-300">
              Оплата проверяется
            </h2>
            <p className="mt-2 text-slate-300">
              Ваша заявка получена. Администратор проверит поступление
              денег и после подтверждения откроет доступ к курсу.
            </p>
          </div>
        ) : paymentStatus === "CONFIRMED" ? (
          <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6">
            <h2 className="text-xl font-semibold text-yellow-300">
              Доступ обрабатывается
            </h2>
            <p className="mt-2 text-slate-300">
              Оплата подтверждена, но доступ пока не обнаружен.
              Обратитесь к администратору.
            </p>
          </div>
        ) : (
          <>
            {paymentStatus === "REJECTED" && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
                <p className="font-semibold text-red-300">
                  Предыдущая заявка отклонена
                </p>
                <p className="mt-2 text-slate-300">
                  Вы можете отправить новую заявку после проверки оплаты.
                </p>
              </div>
            )}

            <PaymentInstructions
              courseSlug={course.slug}
              courseTitle={course.titleRu}
              amount={course.price.toString()}
              bankName=""
              recipientName=""
              cardNumber={process.env.PAYMENT_CARD_NUMBER || ""}
            />
          </>
        )}
      </div>
    </main>
  );
}
