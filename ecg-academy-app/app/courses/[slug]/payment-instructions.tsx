
"use client";

import { useState } from "react";

type Props = {
  courseSlug: string;
  courseTitle: string;
  amount: string;
  bankName: string;
  recipientName: string;
  cardNumber: string;
};

export default function PaymentInstructions(props: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasDetails = Boolean(props.cardNumber);

  async function copyCardNumber() {
    try {
      await navigator.clipboard.writeText(props.cardNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("Не удалось скопировать номер карты.");
    }
  }

  async function submitPayment() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: props.courseSlug }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Не удалось создать заявку.");
        return;
      }

      setSuccess(true);
      setMessage(
        "Заявка отправлена. Доступ откроется после проверки и подтверждения оплаты администратором."
      );
    } catch {
      setMessage("Ошибка соединения с сервером.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold">Оплата курса</h2>

      <p className="mt-3 text-slate-300">
        Сумма к оплате: {props.amount} ₽
      </p>

      {!hasDetails ? (
        <p className="mt-5 rounded-xl bg-yellow-400/10 p-4 text-sm text-yellow-200">
          Реквизиты для оплаты пока настраиваются. Оплата ещё недоступна.
        </p>
      ) : (
        <>
          <div className="mt-5 rounded-xl bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Номер карты</p>
            <p className="mt-2 break-all text-lg font-semibold">
              {props.cardNumber}
            </p>

            <button
              type="button"
              onClick={copyCardNumber}
              className="mt-3 rounded-lg border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10"
            >
              {copied ? "Скопировано" : "Скопировать номер карты"}
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            После перевода нажмите кнопку ниже. Администратор проверит
            поступление денег и вручную откроет доступ к курсу.
          </p>

          <button
            type="button"
            onClick={submitPayment}
            disabled={loading || success}
            className="mt-5 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading
              ? "Отправка..."
              : success
                ? "Заявка отправлена"
                : "Я оплатил"}
          </button>
        </>
      )}

      {message && (
        <p className="mt-4 text-sm text-cyan-300">{message}</p>
      )}
    </section>
  );
}
