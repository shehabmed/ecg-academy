"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentActions({
  paymentId,
}: {
  paymentId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function processPayment(action: "confirm" | "reject") {
    const question =
      action === "confirm"
        ? "Подтвердить получение оплаты и открыть доступ к курсу?"
        : "Отклонить заявку? Доступ к курсу не будет открыт.";

    if (!window.confirm(question)) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/payments/${paymentId}/${action}`,
        { method: "POST" }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Не удалось обработать заявку.");
        return;
      }

      setMessage(data.message);
      router.refresh();
    } catch {
      setMessage("Не удалось связаться с сервером.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => processPayment("confirm")}
        disabled={loading}
        className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
      >
        {loading ? "Обработка..." : "Подтвердить оплату"}
      </button>

      <button
        type="button"
        onClick={() => processPayment("reject")}
        disabled={loading}
        className="rounded-xl border border-red-400/40 px-5 py-3 font-semibold text-red-300 hover:bg-red-400/10 disabled:opacity-50"
      >
        Отклонить заявку
      </button>

      {message && (
        <p className="w-full text-sm text-cyan-300">{message}</p>
      )}
    </div>
  );
}
