import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { Card, Question } from "@/data/types";
import { faNum } from "@/lib/format";
import { cardKey } from "@/lib/progress";
import { useHydratedProgress } from "@/lib/use-hydrated";

export function FlashDeck({
  chapterId,
  cards,
}: {
  chapterId: string;
  cards: Card[];
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { ready, progress } = useHydratedProgress();
  const card = cards[i];
  if (!card) return null;
  const key = cardKey(chapterId, i);
  const known = ready && progress.cards[key];

  function go(next: number) {
    setI(next);
    setFlipped(false);
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-display text-3xl">فلش‌کارت</h2>
        <p className="text-sm text-muted">
          {faNum(i + 1)} از {faNum(cards.length)}
        </p>
      </div>
      <button
        type="button"
        className="flip-scene block w-full text-right"
        onClick={() => setFlipped((v) => !v)}
        aria-label={flipped ? "روی سؤال برگرد" : "پاسخ را نشان بده"}
      >
        <span className={"flip-inner relative grid min-h-52 " + (flipped ? "is-flipped" : "")}>
          <span className="flip-face col-start-1 row-start-1 flex min-h-52 flex-col justify-between rounded-card border border-line bg-panel p-5">
            <span className="text-xs font-semibold text-teal">سؤال</span>
            <span className="text-xl font-semibold leading-relaxed">{card.q}</span>
            <span className="text-sm text-muted">برای دیدن پاسخ بزن</span>
          </span>
          <span className="flip-face flip-back col-start-1 row-start-1 flex min-h-52 flex-col justify-between rounded-card border border-teal bg-teal-ink p-5">
            <span className="text-xs font-semibold text-teal">پاسخ</span>
            <span className="text-lg leading-relaxed text-fg">{card.a}</span>
            <span className="text-sm text-muted">دوباره بزن تا سؤال برگردد</span>
          </span>
        </span>
      </button>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-rose text-rose-ink font-semibold disabled:opacity-40"
          onClick={() => progress.markCard(key, false)}
          disabled={!ready}
        >
          <X className="size-4" aria-hidden="true" />
          بلد نیستم
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-teal text-teal-ink font-semibold disabled:opacity-40"
          onClick={() => progress.markCard(key, true)}
          disabled={!ready}
        >
          <Check className="size-4" aria-hidden="true" />
          {known ? "ثبت شد" : "بلدم"}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-panel font-semibold disabled:opacity-40"
          onClick={() => go(Math.max(0, i - 1))}
          disabled={i === 0}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          قبلی
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-panel-2 font-semibold disabled:opacity-40"
          onClick={() => go(Math.min(cards.length - 1, i + 1))}
          disabled={i === cards.length - 1}
        >
          بعدی
        </button>
      </div>
    </section>
  );
}

export function QuizList({ items }: { items: Question[] }) {
  const [picks, setPicks] = useState<Record<number, number>>({});

  return (
    <section className="mt-10">
      <h2 className="font-display text-3xl">خودت را بسنج</h2>
      <ol className="mt-4 space-y-4">
        {items.map((item, qi) => {
          const pick = picks[qi];
          const revealed = pick !== undefined;
          return (
            <li key={item.q} className="rounded-card border border-line bg-panel p-4">
              <p className="font-semibold leading-relaxed">
                {faNum(qi + 1)}. {item.q}
              </p>
              <div className="mt-3 grid gap-2">
                {item.options.map((opt, oi) => {
                  const chosen = pick === oi;
                  const correct = oi === item.answer;
                  let tone = "border-line bg-panel-2 text-fg";
                  if (revealed && correct) tone = "border-teal bg-teal text-teal-ink";
                  else if (revealed && chosen && !correct) tone = "border-rose bg-rose text-rose-ink";
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={revealed}
                      onClick={() => setPicks((s) => ({ ...s, [qi]: oi }))}
                      className={
                        "min-h-11 rounded-2xl border px-3 py-2 text-right font-medium disabled:cursor-default " +
                        tone
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed ? <p className="mt-3 text-sm leading-relaxed text-muted">{item.why}</p> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
