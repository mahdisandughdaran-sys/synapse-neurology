import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { chapters } from "@/data";
import { Disclaimer, Shell } from "@/components/shell";
import { faNum } from "@/lib/format";
import { cardKey } from "@/lib/progress";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
  head: () => ({ meta: [{ title: "مرور کارت | سیناپس" }] }),
});

type Filter = "all" | "open" | "known";

function ReviewPage() {
  const { ready, progress } = useHydratedProgress();
  const [filter, setFilter] = useState<Filter>("open");
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(
    () =>
      chapters.flatMap((c) =>
        c.cards.map((card, index) => ({
          ...card,
          chapterId: c.id,
          chapter: c.title,
          key: cardKey(c.id, index),
        })),
      ),
    [],
  );

  const shown = deck.filter((card) => {
    if (!ready || filter === "all") return true;
    const known = !!progress.cards[card.key];
    return filter === "known" ? known : !known;
  });

  const safeIndex = shown.length === 0 ? 0 : Math.min(i, shown.length - 1);
  const card = shown[safeIndex];

  return (
    <Shell>
      <p className="text-sm font-semibold text-teal">جعبه مرور</p>
      <h1 className="mt-1 font-display text-4xl leading-none md:text-5xl">کارت‌هایی که هنوز نچسبیده‌اند</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["open", "باقی‌مانده"],
            ["known", "بلدها"],
            ["all", "همه"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setFilter(id);
              setI(0);
              setFlipped(false);
            }}
            className={
              "inline-flex min-h-11 items-center rounded-full px-4 font-semibold " +
              (filter === id ? "bg-teal text-teal-ink" : "border border-line bg-panel")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {!card ? (
        <p className="mt-6 rounded-card border border-line bg-panel p-5">
          این فهرست خالی است. یا همه را بلدی، یا هنوز کارتی را علامت نزده‌ای.
        </p>
      ) : (
        <section className="mt-6">
          <p className="text-sm text-muted">
            {faNum(safeIndex + 1)} از {faNum(shown.length)} · {card.chapter}
          </p>
          <button
            type="button"
            className="flip-scene mt-3 block w-full text-right"
            onClick={() => setFlipped((v) => !v)}
          >
            <span className={"flip-inner relative grid min-h-52 " + (flipped ? "is-flipped" : "")}>
              <span className="flip-face col-start-1 row-start-1 flex min-h-52 flex-col justify-between rounded-card border border-line bg-panel p-5">
                <span className="text-xs font-semibold text-teal">سؤال</span>
                <span className="text-xl font-semibold">{card.q}</span>
                <span className="text-sm text-muted">بزن تا جواب بیاید</span>
              </span>
              <span className="flip-face flip-back col-start-1 row-start-1 flex min-h-52 flex-col justify-between rounded-card border border-teal bg-teal-ink p-5">
                <span className="text-xs font-semibold text-teal">پاسخ</span>
                <span className="text-lg leading-relaxed">{card.a}</span>
                <span className="text-sm text-muted">فصل: {card.chapter}</span>
              </span>
            </span>
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="min-h-11 rounded-full bg-rose font-semibold text-rose-ink"
              onClick={() => {
                progress.markCard(card.key, false);
                setFlipped(false);
              }}
              disabled={!ready}
            >
              بلد نیستم
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full bg-teal font-semibold text-teal-ink"
              onClick={() => {
                progress.markCard(card.key, true);
                setFlipped(false);
                setI(safeIndex + 1);
              }}
              disabled={!ready}
            >
              بلدم
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="min-h-11 rounded-full border border-line bg-panel"
              onClick={() => {
                setI(Math.max(0, safeIndex - 1));
                setFlipped(false);
              }}
            >
              قبلی
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-line bg-panel"
              onClick={() => {
                setI(Math.min(shown.length - 1, safeIndex + 1));
                setFlipped(false);
              }}
            >
              بعدی
            </button>
          </div>
          <Link
            to="/chapter/$id"
            params={{ id: card.chapterId }}
            className="mt-4 inline-flex min-h-11 items-center text-teal"
          >
            متن همین فصل
          </Link>
        </section>
      )}
      <Disclaimer />
    </Shell>
  );
}
