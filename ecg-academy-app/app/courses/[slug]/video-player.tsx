"use client";

import { useEffect, useState } from "react";

export default function VideoPlayer({
  lessonId,
}: {
  lessonId: string;
}) {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadVideo() {
      try {
        const response = await fetch(
          `/api/lessons/${lessonId}/video`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Не удалось загрузить видео.");
        }

        if (!cancelled) {
          setVideoUrl(result.videoUrl);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Ошибка загрузки видео."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVideo();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (loading) {
    return (
      <p className="mt-5 text-sm text-slate-400">
        Загружаем видео...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-5 rounded-xl bg-red-400/10 p-3 text-sm text-red-300">
        {error}
      </p>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="mt-5 overflow-hidden rounded-xl bg-black">
      <video
        controls
        playsInline
        preload="metadata"
        className="w-full"
        src={videoUrl}
      >
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </div>
  );
}