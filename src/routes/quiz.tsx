import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { chapters } from "@/data";
import type { Question } from "@/data/types";
import { Disclaimer, Shell } from "@/components/shell";
import { faNum } from "@/lib/format";
import { useProgress } from "@/lib/progress";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({ meta: [{ title: "آزمون | سیناپس" }] }),
});

type Item = Question & { chapter: string };

function shuffle<T>(list: T[]) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildExam(): Item[] {
  const pool = chapters.flatMap((c) => c.quiz.map((q) => ({ ...q, chapter: c.title })));
  return shuffle(pool).slice(0, 12);
}

export function QuizPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [left, setLeft] = useState(12 * 60);
  const [done, setDone] = useState(false);
  const { ready, progress } = useHydratedProgress();

  useEffect(() => {
    if (!items || done) return;
    const id = window.setInterval(() => setLeft((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [items, done]);

  useEffect(() => {
    if (items && !done && left <= 0) setDone(true);
  }, [items, done, left]);

  const score = useMemo(() => {
    if (!items) return 0;
    return items.reduce((n, q, i) => n + (picks[i] === q.answer ? 1 : 0), 0);
  }, [items, picks]);

  useEffect(() => {
    if (!done || !items || !ready) return;
    const stamp = items.map((q) => q.q).join("|");
    const state = useProgress.getState();
    if (state.scores.some((s) => s.stamp === stamp)) return;
    state.addScore({ at: Date.now(), correct: score, total: items.length, stamp });
  }, [done, items, ready, score]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <Shell>
      <p className="text-sm font-semibold text-teal">آزمون ترکیبی</p>
      <h1 className="mt-1 font-display text-4xl leading-none md:text-5xl">دوازده سؤال، دوازده دقیقه</h1>
      <p className="mt-3 max-w-2xl text-muted">
        از بانک همه فصل‌ها برداشته می‌شود. وقت که تمام شود پاسخ‌ها قفل می‌شوند. این نمره جای آزمون رسمی نیست.
      </p>

      {!items ? (
        <button
          type="button"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-amber px-6 font-semibold text-amber-ink"
          onClick={() => {
            setItems(buildExam());
            setStep(0);
            setPicks({});
            setLeft(12 * 60);
            setDone(false);
          }}
        >
          شروع آزمون
        </button>
      ) : done ? (
        <Result items={items} picks={picks} score={score} />
      ) : (
        <ExamStep
          items={items}
          step={step}
          picks={picks}
          clock={`${faNum(mm)}:${faNum(ss)}`}
          onPick={(oi) => setPicks((s) => ({ ...s, [step]: oi }))}
          onPrev={() => setStep((s) => Math.max(0, s - 1))}
          onNext={() => setStep((s) => Math.min(items.length - 1, s + 1))}
          onFinish={() => setDone(true)}
        />
      )}

      {ready && progress.scores.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-semibold">نمره‌های این دستگاه</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {progress.scores.slice(0, 5).map((s) => (
              <li key={s.at}>
                {faNum(s.correct)} از {faNum(s.total)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Disclaimer />
    </Shell>
  );
}

function ExamStep({
  items,
  step,
  picks,
  clock,
  onPick,
  onPrev,
  onNext,
  onFinish,
}: {
  items: Item[];
  step: number;
  picks: Record<number, number>;
  clock: string;
  onPick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const q = items[step];
  return (
    <section className="mt-6 rounded-card border border-line bg-panel p-5">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {faNum(step + 1)} / {faNum(items.length)} · {q.chapter}
        </span>
        <span className="font-semibold text-amber">{clock}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-relaxed">{q.q}</h2>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, oi) => {
          const on = picks[step] === oi;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onPick(oi)}
              className={
                "min-h-11 rounded-2xl border px-3 text-right " +
                (on ? "border-teal bg-teal text-teal-ink" : "border-line bg-panel-2")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-full border border-line px-4"
          onClick={onPrev}
          disabled={step === 0}
        >
          قبلی
        </button>
        {step < items.length - 1 ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full bg-panel-2 px-4 font-semibold"
            onClick={onNext}
          >
            بعدی
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full bg-teal px-4 font-semibold text-teal-ink"
            onClick={onFinish}
          >
            پایان و کارنامه
          </button>
        )}
      </div>
    </section>
  );
}

function Result({
  items,
  picks,
  score,
}: {
  items: Item[];
  picks: Record<number, number>;
  score: number;
}) {
  return (
    <section className="mt-6">
      <p className="font-display text-5xl text-amber">
        {faNum(score)}
        <span className="text-2xl text-muted"> / {faNum(items.length)}</span>
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((q, i) => {
          const ok = picks[i] === q.answer;
          return (
            <li key={q.q} className="rounded-card border border-line bg-panel p-4">
              <p className="text-sm text-muted">{q.chapter}</p>
              <p className="mt-1 font-semibold">{q.q}</p>
              <p className={"mt-2 text-sm " + (ok ? "text-teal" : "text-rose")}>
                {ok ? "درست" : "نادرست"} · پاسخ: {q.options[q.answer]}
              </p>
              <p className="mt-1 text-sm text-muted">{q.why}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
