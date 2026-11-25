"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLessonForm({
  courseId,
  initialPosition,
}: {
  courseId: string;
  initialPosition: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const videoFile = form.get("video") as File | null;

    try {
      let videoKey = "";

      if (videoFile && videoFile.size > 0) {
        if (videoFile.type !== "video/mp4") {
          setError("Выберите видео в формате MP4.");
          return;
        }

        if (videoFile.size > 500 * 1024 * 1024) {
          setError("Размер видео не должен превышать 500 МБ.");
          return;
        }

        const urlResponse = await fetch("/api/admin/storage/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType: "video/mp4",
            size: videoFile.size,
          }),
        });

        const uploadData = await urlResponse.json();

        if (!urlResponse.ok) {
          throw new Error(uploadData.error || "Не удалось подготовить загрузку.");
        }

        const uploadResponse = await fetch(uploadData.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "video/mp4" },
          body: videoFile,
        });

        if (!uploadResponse.ok) {
          throw new Error("Не удалось загрузить видео в хранилище.");
        }

        videoKey = uploadData.key;
      }

      const response = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleRu: form.get("titleRu"),
          titleEn: form.get("titleEn"),
          contentRu: form.get("contentRu"),
          contentEn: form.get("contentEn"),
          videoUrl: videoKey,
          position: Number(form.get("position")),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не удалось создать урок.");
      }

      router.push(`/admin/courses/${courseId}/lessons`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка связи с сервером."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div>
        <label className="mb-2 block text-sm">
          Название урока на русском
        </label>
        <input required name="titleRu" maxLength={200} className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm">
          Название урока на английском
        </label>
        <input required name="titleEn" maxLength={200} className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm">
          Учебный материал на русском
        </label>
        <textarea
          name="contentRu"
          rows={8}
          maxLength={50000}
          className={inputClass}
          placeholder="Вставь сюда текст урока..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">
          Учебный материал на английском
        </label>
        <textarea
          name="contentEn"
          rows={8}
          maxLength={50000}
          className={inputClass}
          placeholder="Enter lesson text..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">
          Видео урока (MP4, необязательно)
        </label>
        <input
          name="video"
          type="file"
          accept="video/mp4,.mp4"
          className={inputClass}
        />
        <p className="mt-2 text-xs text-slate-500">
          Максимальный размер файла — 500 МБ.
        </p>
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
          defaultValue={initialPosition}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-cyan-500 p-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
      >
        {loading ? "Загружаем видео и сохраняем урок..." : "Создать урок"}
      </button>
    </form>
  );
}