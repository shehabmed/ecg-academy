"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  isFree: boolean;
  price: string;
  status: "DRAFT" | "PUBLISHED";
};

export default function EditCourseForm({ course }: { course: Course }) {
  const router = useRouter();
  const [isFree, setIsFree] = useState(course.isFree);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
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
        setError(result.error || "Не удалось сохранить изменения");
        return;
      }

      setSuccess("Изменения успешно сохранены.");
      router.refresh();
    } catch {
      setError("Не удалось связаться с сервером.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div>
        <label className="mb-2 block text-sm">Название на русском</label>
        <input required name="titleRu" maxLength={200} defaultValue={course.titleRu} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
      </div>

      <div>
        <label className="mb-2 block text-sm">Название на английском</label>
        <input required name="titleEn" maxLength={200} defaultValue={course.titleEn} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
      </div>

      <div>
        <label className="mb-2 block text-sm">Описание на русском</label>
        <textarea name="descriptionRu" maxLength={10000} rows={4} defaultValue={course.descriptionRu} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
      </div>

      <div>
        <label className="mb-2 block text-sm">Описание на английском</label>
        <textarea name="descriptionEn" maxLength={10000} rows={4} defaultValue={course.descriptionEn} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
      </div>

      <div className="flex items-center gap-3">
        <input id="editIsFree" type="checkbox" checked={isFree} onChange={(event) => setIsFree(event.target.checked)} className="h-5 w-5" />
        <label htmlFor="editIsFree">Бесплатный курс</label>
      </div>

      {!isFree && (
        <div>
          <label className="mb-2 block text-sm">Цена в рублях</label>
          <input required name="price" type="number" min="0.01" step="0.01" defaultValue={course.isFree ? "" : course.price} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3" placeholder="Например: 2990" />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm">Статус курса</label>
        <select name="status" defaultValue={course.status} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3">
          <option value="DRAFT">Черновик</option>
          <option value="PUBLISHED">Опубликован</option>
        </select>
      </div>

      {error && <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      {success && <p className="rounded-xl bg-green-400/10 p-3 text-sm text-green-300">{success}</p>}

      <button disabled={loading} type="submit" className="w-full rounded-xl bg-cyan-500 p-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
        {loading ? "Сохраняем..." : "Сохранить изменения"}
      </button>
    </form>
  );
}