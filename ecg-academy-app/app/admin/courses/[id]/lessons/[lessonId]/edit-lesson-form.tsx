"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Lesson = {
  id: string;
  titleRu: string;
  titleEn: string;
  contentRu: string;
  contentEn: string;
  videoUrl: string;
  position: number;
};

export default function EditLessonForm({
  courseId,
  lesson,
}: {
  courseId: string;
  lesson: Lesson;
}) {
  const router = useRouter();
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
      const response = await fetch(
        `/api/admin/courses/${courseId}/lessons/${lesson.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleRu: form.get("titleRu"),
            titleEn: form.get("titleEn"),
            contentRu: form.get("contentRu"),
            contentEn: form.get("contentEn"),
            videoUrl: form.get("videoUrl"),
            position: Number(form.get("position")),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Не удалось сохранить изменения");
        return;
      }

      setSuccess("Изменения сохранены");
      router.refresh();
    } catch {
      setError("Не удалось связаться с сервером");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label className="mb-2 block text-sm">Название на русском</label>
        <input
          required
          name="titleRu"
          maxLength={200}
          defaultValue={lesson.titleRu}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Название на английском</label>
        <input
          required
          name="titleEn"
          maxLength={200}
          defaultValue={lesson.titleEn}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Учебный материал на русском</label>
        <textarea
          name="contentRu"
          rows={8}
          maxLength={50000}
          defaultValue={lesson.contentRu}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Учебный материал на английском</label>
        <textarea
          name="contentEn"
          rows={8}
          maxLength={50000}
          defaultValue={lesson.contentEn}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Ссылка на видео</label>
        <input
          name="videoUrl"
          type="url"
          maxLength={2000}
          defaultValue={lesson.videoUrl}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Номер урока</label>
        <input
          required
          name="position"
          type="number"
          min="0"
          max="10000"
          step="1"
          defaultValue={lesson.position}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-xl bg-green-400/10 p-3 text-sm text-green-300">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-cyan-500 p-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
      >
        {loading ? "Сохраняем..." : "Сохранить изменения"}
      </button>

      <button
        type="button"
        onClick={() => router.push(`/admin/courses/${courseId}/lessons`)}
        className="w-full rounded-xl border border-white/10 p-3 text-white hover:bg-white/5"
      >
        Назад к урокам
      </button>
    </form>
  );
}