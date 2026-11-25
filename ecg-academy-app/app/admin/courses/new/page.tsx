"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const router = useRouter();
  const [isFree, setIsFree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titleRu: form.get("titleRu"),
        titleEn: form.get("titleEn"),
        descriptionRu: form.get("descriptionRu"),
        descriptionEn: form.get("descriptionEn"),
        isFree,
        price: isFree ? 0 : Number(form.get("price")),
        status: form.get("status"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Не удалось сохранить курс");
      setLoading(false);
      return;
    }

    router.push("/admin/courses");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <a href="/admin/courses" className="text-cyan-400">
          ← Назад к курсам
        </a>

        <h1 className="mt-8 text-3xl font-bold">Добавить курс</h1>
        <p className="mt-2 text-slate-400">
          Заполни информацию о новом курсе ECG Academy.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm">Название на русском</label>
            <input required name="titleRu" maxLength={200} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" placeholder="Например: Основы ЭКГ" />
          </div>

          <div>
            <label className="mb-2 block text-sm">Название на английском</label>
            <input required name="titleEn" maxLength={200} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" placeholder="Example: ECG Basics" />
          </div>

          <div>
            <label className="mb-2 block text-sm">Описание на русском</label>
            <textarea name="descriptionRu" maxLength={10000} rows={4} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm">Описание на английском</label>
            <textarea name="descriptionEn" maxLength={10000} rows={4} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
          </div>

          <div className="flex items-center gap-3">
            <input id="isFree" type="checkbox" checked={isFree} onChange={(event) => setIsFree(event.target.checked)} className="h-5 w-5" />
            <label htmlFor="isFree">Бесплатный курс</label>
          </div>

          {!isFree && (
            <div>
              <label className="mb-2 block text-sm">Цена в рублях</label>
              <input required name="price" type="number" min="0.01" step="0.01" className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" placeholder="Например: 2990" />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm">Статус курса</label>
            <select name="status" className="w-full rounded-xl border border-white/10 bg-slate-900 p-3">
              <option value="DRAFT">Черновик</option>
              <option value="PUBLISHED">Опубликовать</option>
            </select>
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button disabled={loading} type="submit" className="w-full rounded-xl bg-cyan-500 p-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
            {loading ? "Сохраняем..." : "Сохранить курс"}
          </button>
        </form>
      </div>
    </main>
  );
}
