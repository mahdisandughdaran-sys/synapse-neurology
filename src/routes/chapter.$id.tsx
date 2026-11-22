import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Lightbulb } from "lucide-react";
import { chapters, getChapter } from "@/data";
import { pageOfChapter } from "@/data/leaves";
import { chapterIcons } from "@/components/icons";
import { Disclaimer, Shell } from "@/components/shell";
import { FlashDeck, QuizList } from "@/components/study";
import { faNum } from "@/lib/format";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/chapter/$id")({
  component: ChapterPage,
  head: ({ params }) => ({
    meta: [{ title: `${getChapter(params.id)?.title ?? "فصل"} | سیناپس` }],
  }),
});

function ChapterPage() {
  const { id } = Route.useParams();
  const chapter = getChapter(id);
  const { ready, progress } = useHydratedProgress();

  if (!chapter) {
    return (
      <Shell>
        <p className="rounded-card border border-line bg-panel p-6">این فصل در نقشه نیست.</p>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center text-teal">
          برگشت به نقشه
        </Link>
      </Shell>
    );
  }

  const Icon = chapterIcons[chapter.id];
  const index = chapters.findIndex((c) => c.id === chapter.id);
  const prev = chapters[index - 1];
  const next = chapters[index + 1];
  const done = ready && !!progress.done[chapter.id];

  return (
    <Shell>
      <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <ArrowRight className="size-4" aria-hidden="true" />
        نقشه فصل‌ها
      </Link>
      <header className="mt-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-amber">
            فصل {faNum(chapter.n)} · {chapter.en}
          </p>
          <h1 className="mt-1 font-display text-4xl leading-none md:text-5xl">{chapter.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{chapter.blurb}</p>
          <Link
            to="/read/$n"
            params={{ n: String(pageOfChapter(chapter.id)) }}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-teal px-4 text-sm font-semibold text-teal-ink"
          >
            این فصل را برگ‌به‌برگ بخوان
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {Icon ? (
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-panel text-teal">
            <Icon className="size-7" aria-hidden="true" />
          </span>
        ) : null}
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="space-y-3">
          {chapter.sections.map((s) => (
            <section key={s.h} className="rounded-card border border-line bg-panel p-5">
              <h2 className="text-lg font-semibold">{s.h}</h2>
              <p className="mt-2 leading-relaxed text-muted">{s.p}</p>
            </section>
          ))}
        </article>
        <aside className="space-y-3">
          <section className="rounded-card border border-line bg-panel p-5">
            <h2 className="flex items-center gap-2 font-semibold text-amber">
              <Lightbulb className="size-5" aria-hidden="true" />
              نکته‌هایی که می‌مانند
            </h2>
            <ul className="mt-3 space-y-3">
              {chapter.pearls.map((p) => (
                <li key={p} className="text-sm leading-relaxed">
                  {p}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-card border border-rose bg-rose-ink p-5">
            <h2 className="flex items-center gap-2 font-semibold text-rose">
              <AlertTriangle className="size-5" aria-hidden="true" />
              پرچم قرمز
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {chapter.flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
          <button
            type="button"
            disabled={!ready}
            onClick={() => progress.markChapter(chapter.id, !done)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-teal font-semibold text-teal-ink disabled:opacity-50"
          >
            <Check className="size-4" aria-hidden="true" />
            {done ? "این فصل را ناتمام کن" : "این فصل را تمام‌شده علامت بزن"}
          </button>
        </aside>
      </div>

      <FlashDeck chapterId={chapter.id} cards={chapter.cards} />
      <QuizList items={chapter.quiz} />

      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/chapter/$id"
            params={{ id: prev.id }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-panel px-4 font-semibold"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/chapter/$id"
            params={{ id: next.id }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-panel-2 px-4 font-semibold"
          >
            {next.title}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <Disclaimer />
    </Shell>
  );
}
