"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [language, setLanguage] = useState<"en" | "ru">("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const ru = language === "ru";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || (ru ? "Не удалось войти." : "Login failed."));
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setMessage(ru ? "Не удалось связаться с сервером." : "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ECG<span className="text-cyan-400">Academy</span>
        </Link>

        <button
          onClick={() => setLanguage(ru ? "en" : "ru")}
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          {ru ? "English" : "Русский"}
        </button>
      </div>

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
              ♥
            </div>

            <h1 className="text-3xl font-bold">
              {ru ? "С возвращением!" : "Welcome back"}
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              {ru
                ? "Войдите в свой аккаунт ECG Academy."
                : "Sign in to your ECG Academy account."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                required
                type="email"
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-[#0b1929] px-4 py-3 outline-none transition focus:border-cyan-400"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {ru ? "Пароль" : "Password"}
              </label>

              <input
                required
                type="password"
                maxLength={64}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-[#0b1929] px-4 py-3 outline-none transition focus:border-cyan-400"
                placeholder={ru ? "Введите пароль" : "Enter your password"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3.5 font-semibold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? (ru ? "Входим..." : "Signing in...")
                : (ru ? "Войти" : "Sign in")}
            </button>

            {message && (
              <p
                role="status"
                className="rounded-xl bg-white/10 p-3 text-center text-sm text-slate-200"
              >
                {message}
              </p>
            )}
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            {ru ? "Ещё нет аккаунта?" : "Don't have an account?"}{" "}
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300"
            >
              {ru ? "Зарегистрироваться" : "Create account"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
