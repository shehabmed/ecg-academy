"use client";

import { useState } from "react";

export default function Home() {
  const [lang, setLang] = useState<"en" | "ru">("en");

  const ru = lang === "ru";

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#17243b]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10233f] text-xl font-bold text-cyan-400">ECG</div>
            <div>
              <div className="text-lg font-extrabold tracking-tight">ECG ACADEMY</div>
              <div className="text-[10px] font-semibold tracking-[3px] text-slate-500">MEDICAL EDUCATION</div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#courses" className="hover:text-cyan-600">{ru ? "Курсы" : "Courses"}</a>
            <a href="#about" className="hover:text-cyan-600">{ru ? "О платформе" : "About"}</a>
            <a href="#contact" className="hover:text-cyan-600">{ru ? "Контакты" : "Contact"}</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setLang(ru ? "en" : "ru")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50">
              {ru ? "EN" : "RU"}
            </button>
            <a href="#courses" className="hidden rounded-lg bg-[#10233f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 sm:block">
              {ru ? "Начать обучение" : "Start learning"}
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#10233f]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold tracking-wider text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {ru ? "ОБРАЗОВАНИЕ В КАРДИОЛОГИИ" : "CARDIOLOGY EDUCATION"}
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              {ru ? "Научитесь понимать каждое " : "Learn Every "}
              <span className="text-cyan-400">{ru ? "сердцебиение." : "Heartbeat."}</span>
              <br />
              {ru ? "Освойте " : "Understand Every "}
              <span className="text-cyan-400">{ru ? "ЭКГ." : "ECG."}</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              {ru
                ? "Изучайте электрокардиографию шаг за шагом. Практические уроки, понятные объяснения и системный подход к интерпретации ЭКГ."
                : "Master electrocardiography step by step. Explore practical lessons, clear explanations, and a structured approach to ECG interpretation."}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#courses" className="rounded-xl bg-cyan-400 px-7 py-4 text-sm font-bold text-[#10233f] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300">
                {ru ? "Изучить курсы →" : "Explore courses →"}
              </a>
              <a href="#about" className="rounded-xl border border-white/25 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
                {ru ? "Узнать больше" : "Learn more"}
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 text-sm text-slate-300">
              <div><span className="block text-2xl font-bold text-white">EN / RU</span>{ru ? "Два языка" : "Bilingual learning"}</div>
              <div><span className="block text-2xl font-bold text-white">24/7</span>{ru ? "Обучение в любое время" : "Learn anytime"}</div>
              <div><span className="block text-2xl font-bold text-white">ECG</span>{ru ? "Практический подход" : "Practical approach"}</div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold tracking-widest text-cyan-300">ECG ACADEMY</div>
                  <div className="mt-1 text-lg font-bold text-white">{ru ? "Электрическая активность сердца" : "Heart electrical activity"}</div>
                </div>
                <div className="rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">ECG • 12 LEADS</div>
              </div>

              <div className="overflow-hidden rounded-xl bg-[#07172b] p-4">
                <svg viewBox="0 0 600 220" className="w-full" role="img" aria-label="Illustrative ECG waveform">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#24415b" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="600" height="220" fill="url(#grid)" />
                  <path d="M0 112 L55 112 Q70 112 80 98 Q92 83 104 112 L145 112 L165 112 L180 132 L198 30 L218 168 L235 112 L270 112 Q290 112 305 95 Q322 78 342 112 L395 112 Q410 112 425 98 Q442 82 460 112 L500 112 L520 112 L536 130 L552 35 L570 160 L585 112 L600 112" fill="none" stroke="#35d4d0" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["12", ru ? "Отведений" : "Leads"],
                  ["P-QRS-T", ru ? "Комплекс" : "Complex"],
                  ["360°", ru ? "Понимание" : "Understanding"]
                ].map(([number, label]) => (
                  <div key={number} className="rounded-xl bg-white/5 p-3 text-center">
                    <div className="text-lg font-bold text-cyan-300">{number}</div>
                    <div className="mt-1 text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="text-xs text-slate-500">{ru ? "Ваш путь к знаниям" : "Your learning journey"}</div>
              <div className="mt-1 font-bold text-[#10233f]">{ru ? "Шаг за шагом" : "Step by step"}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="text-xs font-bold tracking-[3px] text-cyan-700">{ru ? "НАШИ ПРОГРАММЫ" : "OUR PROGRAMS"}</div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{ru ? "Изучайте ЭКГ с основ" : "Explore our courses"}</h2>
            <p className="mt-3 max-w-xl text-slate-500">{ru ? "Структурированное обучение для студентов-медиков и специалистов." : "Structured ECG education for medical students and healthcare professionals."}</p>
          </div>
          <span className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-bold text-cyan-800">{ru ? "Первый курс доступен" : "First course available"}</span>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#10233f] to-[#17627a] p-8">
              <div className="text-center">
                <div className="text-5xl font-black tracking-tight text-cyan-300">ECG</div>
                <div className="mt-3 text-sm font-semibold tracking-[3px] text-white">BASIC PRINCIPLES</div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{ru ? "Основы" : "Beginner"}</span>
                <span className="text-xs text-slate-400">{ru ? "EN / RU" : "EN / RU"}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold">{ru ? "Основные принципы ЭКГ" : "Basic Principles of ECG"}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500">
                {ru ? "Электроды, отведения, векторы и основы формирования электрокардиограммы." : "Learn about electrodes, leads, vectors, and the fundamentals of ECG recording."}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-sm font-semibold text-slate-500">{ru ? "Учебный курс" : "Learning course"}</span>
                <span className="text-sm font-bold text-cyan-700">{ru ? "Скоро →" : "Coming soon →"}</span>
              </div>
            </div>
          </article>

          <article className="flex min-h-80 flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">+</div>
            <h3 className="mt-5 text-lg font-bold text-slate-700">{ru ? "Новые курсы" : "More courses"}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{ru ? "Новые учебные программы будут добавляться сюда." : "New learning programs will be added here."}</p>
            <span className="mt-5 text-xs font-bold tracking-widest text-slate-400">{ru ? "СКОРО" : "COMING SOON"}</span>
          </article>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold tracking-[3px] text-cyan-700">{ru ? "ПОЧЕМУ ECG ACADEMY" : "WHY ECG ACADEMY"}</div>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{ru ? "Понимание важнее заучивания" : "Understand, don't just memorize"}</h2>
            <p className="mt-4 leading-7 text-slate-500">{ru ? "Наша цель — помочь вам понять электрическую активность сердца и научиться уверенно анализировать ЭКГ." : "Our goal is to help you understand the heart's electrical activity and develop confidence in ECG interpretation."}</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["01", ru ? "Понятные объяснения" : "Clear explanations", ru ? "Сложные концепции разобраны простым и последовательным языком." : "Complex concepts explained in a clear, structured way."],
              ["02", ru ? "Практическое обучение" : "Practical learning", ru ? "Связывайте теорию с реальными принципами интерпретации ЭКГ." : "Connect theory with practical ECG interpretation principles."],
              ["03", ru ? "Два языка" : "Bilingual education", ru ? "Обучайтесь на английском или русском языке." : "Learn in English or Russian."],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border border-slate-200 p-7">
                <div className="text-sm font-extrabold text-cyan-700">{number}</div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-[#10233f] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-xs font-bold tracking-[3px] text-cyan-300">ECG ACADEMY</div>
          <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">{ru ? "Ваш путь к пониманию ЭКГ начинается здесь" : "Your ECG learning journey starts here"}</h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">{ru ? "Изучайте основы, развивайте навыки и углубляйте свои знания." : "Build your foundations, develop your skills, and deepen your understanding."}</p>
          <a href="#courses" className="mt-8 inline-flex rounded-xl bg-cyan-400 px-8 py-4 text-sm font-bold text-[#10233f] transition hover:bg-cyan-300">{ru ? "Посмотреть курс" : "Explore the course"} →</a>
        </div>
      </section>

      <footer className="bg-[#0b192c] px-6 py-8 text-center text-xs text-slate-400">
        © 2026 ECG Academy. {ru ? "Все права защищены." : "All rights reserved."}
        <div className="mt-2 text-slate-500">{ru ? "Образовательная платформа по электрокардиографии." : "A bilingual ECG medical education platform."}</div>
      </footer>
    </main>
  );
}
