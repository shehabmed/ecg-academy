import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PaymentActions from "./payment-actions";

export const instant = false;

export default async function AdminPaymentsPage() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    redirect("/login");
  }

  const payments = await prisma.payment.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      course: {
        select: { titleRu: true, titleEn: true },
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

        <h1 className="mt-3 text-3xl font-bold">Заявки на оплату</h1>
        <p className="mt-2 text-slate-400">
          Проверяй поступление денег и подтверждай оплату студентов.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Всего заявок</p>
            <p className="mt-2 text-3xl font-semibold">{payments.length}</p>
          </div>
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
            <p className="text-sm text-slate-400">Ожидают проверки</p>
            <p className="mt-2 text-3xl font-semibold text-yellow-300">
              {payments.filter((p) => p.status === "PENDING").length}
            </p>
          </div>
          <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
            <p className="text-sm text-slate-400">Подтверждены</p>
            <p className="mt-2 text-3xl font-semibold text-green-300">
              {payments.filter((p) => p.status === "CONFIRMED").length}
            </p>
          </div>
        </div>

        <section className="mt-8 space-y-4">
          {payments.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              Заявок пока нет.
            </div>
          ) : (
            payments.map((payment) => (
              <article
                key={payment.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {payment.course.titleRu}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {payment.course.titleEn}
                    </p>
                    <p className="mt-4">{payment.user.name}</p>
                    <p className="text-sm text-slate-400">
                      {payment.user.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-semibold">
                      {payment.amount.toString()} ₽
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {payment.status === "PENDING"
                        ? "Ожидает проверки"
                        : payment.status === "CONFIRMED"
                          ? "Оплата подтверждена"
                          : "Отклонена"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(payment.createdAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>

                {payment.status === "PENDING" && (
                  <PaymentActions paymentId={payment.id} />
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
