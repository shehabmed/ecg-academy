"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [language, setLanguage] = useState<"en" | "ru">("en");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const ru = language === "ru";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage(ru ? "Пароли не совпадают." : "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || (ru ? "Ошибка регистрации." : "Registration failed."));
        return;
      }

      setMessage(
        ru
          ? "Аккаунт успешно создан! Теперь можно войти."
          : "Account created successfully! You can now sign in."
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
              {ru ? "Создать аккаунт" : "Create account"}
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              {ru
                ? "Присоединяйтесь к ECG Academy и начните изучать ЭКГ."
                : "Join ECG Academy and start learning ECG."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {ru ? "Ваше имя" : "Full name"}
              </label>
              <input
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-[#0b1929] px-4 py-3 outline-none transition focus:border-cyan-400"
                placeholder={ru ? "Введите имя" : "Enter your name"}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
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
                minLength={8}
                maxLength={64}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-[#0b1929] px-4 py-3 outline-none transition focus:border-cyan-400"
                placeholder={ru ? "Минимум 8 символов" : "At least 8 characters"}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {ru ? "Повторите пароль" : "Confirm password"}
              </label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-[#0b1929] px-4 py-3 outline-none transition focus:border-cyan-400"
                placeholder={ru ? "Введите пароль ещё раз" : "Enter your password again"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3.5 font-semibold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? (ru ? "Создаём аккаунт..." : "Creating account...")
                : (ru ? "Зарегистрироваться" : "Create account")}
            </button>

            {message && (
              <p role="status" className="rounded-xl bg-white/10 p-3 text-center text-sm text-slate-200">
                {message}
              </p>
            )}
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            {ru ? "Уже есть аккаунт?" : "Already have an account?"}{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              {ru ? "Войти" : "Sign in"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
