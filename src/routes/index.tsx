import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Brain, Search } from "lucide-react";
import { chapters, cardCount, questionCount } from "@/data";
import { leaves } from "@/data/leaves";
import { cases } from "@/data/cases";
import { chapterIcons } from "@/components/icons";
import { Disclaimer, Shell } from "@/components/shell";
import { faNum } from "@/lib/format";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [q, setQ] = useState("");
  const { ready, progress } = useHydratedProgress();
  const doneCount = ready ? chapters.filter((c) => progress.done[c.id]).length : 0;
  const knownCards = ready ? Object.values(progress.cards).filter(Boolean).length : 0;
  const next = chapters.find((c) => !progress.done[c.id]) ?? chapters[0];
  const shownNext = ready ? next : chapters[0];

  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return chapters;
    return chapters.filter(
      (c) =>
        c.title.includes(s) || c.en.toLowerCase().includes(s.toLowerCase()) || c.blurb.includes(s),
    );
  }, [q]);

  const lastScore = ready ? progress.scores[0] : undefined;

  return (
    <Shell>
      <section className="grid gap-4 rounded-card border border-line bg-panel p-5 md:grid-cols-[1.4fr_0.8fr] md:p-8">
        <div>
          <p className="text-sm font-semibold text-teal">همراه مطالعه · ویراست آموزشی مستقل</p>
          <h1 className="mt-2 font-display text-5xl leading-none md:text-6xl">
            هر صفحه را قدم‌به‌قدم بخوان
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {faNum(leaves.length)} صفحه آموزشی به ترتیب بیست‌وسه فصل درسنامه انجمن مغز و اعصاب
            ایران. هر صفحه اول هدف را می‌گوید، بعد درس را باز می‌کند، حاشیه امتحان را می‌گذارد و تا
            جواب ندهی صفحه بعد روشن نمی‌شود. متن چاپی کتاب بازنشر نشده.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/read"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal px-5 font-semibold text-teal-ink"
            >
              <BookOpenText className="size-4" aria-hidden="true" />
              دفتر برگ‌به‌برگ
            </Link>
            <Link
              to="/chapter/$id"
              params={{ id: shownNext.id }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-panel-2 px-5 font-semibold"
            >
              ادامه فصل {shownNext.title}
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            <Link to="/exam" className="font-semibold text-teal">
              ایستگاه معاینه
            </Link>{" "}
            و{" "}
            <Link to="/quiz" className="font-semibold text-teal">
              آزمون ترکیبی
            </Link>{" "}
            سر جایشان مانده‌اند. مسیر جداگانه{" "}
            <Link to="/aminoff" className="font-semibold text-amber">
              صد صفحهٔ اول روش بالینی
            </Link>{" "}
            هم کنار این بیست‌وسه فصل است، نه به‌جایش.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-2">
          <Stat k="فصل" v={faNum(doneCount) + " از " + faNum(chapters.length)} />
          <Stat k="کارت بلد" v={faNum(knownCards) + " از " + faNum(cardCount())} />
          <Stat k="کیس" v={faNum(cases.length)} />
          <Stat k="بانک سؤال" v={faNum(questionCount())} />
        </dl>
      </section>

      {lastScore ? (
        <p className="mt-4 text-sm text-muted">
          آخرین آزمون: {faNum(lastScore.correct)} از {faNum(lastScore.total)}
        </p>
      ) : null}

      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جست‌وجوی فصل، مثلاً صرع یا سرگیجه"
          className="min-h-12 w-full rounded-full border border-line bg-panel pr-12 pl-4 text-fg outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
        />
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const Icon = chapterIcons[c.id] ?? Brain;
          const done = ready && progress.done[c.id];
          return (
            <Link
              key={c.id}
              to="/chapter/$id"
              params={{ id: c.id }}
              className="flex min-h-36 flex-col justify-between rounded-card border border-line bg-panel p-4 transition-colors duration-200 hover:border-teal"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-panel-2 text-teal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-3xl text-amber">{faNum(c.n)}</span>
              </span>
              <span>
                <span className="mt-3 block font-semibold leading-snug">{c.title}</span>
                <span className="mt-1 block text-sm text-muted">
                  {faNum(c.minutes)} دقیقه
                  {done ? " · تمام شده" : ""}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-panel p-4 text-muted">
          فصلی با این عبارت پیدا نشد.
        </p>
      ) : null}
      <Disclaimer />
    </Shell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-line bg-ink p-3">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="mt-1 font-display text-2xl leading-none">{v}</dd>
    </div>
  );
}
