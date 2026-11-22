import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cases } from "@/data/cases";
import { Disclaimer, Shell } from "@/components/shell";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/cases/$id")({
  component: CasePage,
  head: ({ params }) => ({
    meta: [{ title: `${cases.find((c) => c.id === params.id)?.title ?? "کیس"} | سیناپس` }],
  }),
});

function CasePage() {
  const { id } = Route.useParams();
  const item = cases.find((c) => c.id === id);
  const [pick, setPick] = useState<number | null>(null);
  const { ready, progress } = useHydratedProgress();

  if (!item) {
    return (
      <Shell>
        <p>این کیس نیست.</p>
      </Shell>
    );
  }

  const current = item;

  function choose(index: number) {
    setPick(index);
    if (ready) progress.markCase(current.id);
  }

  const revealed = pick !== null;

  return (
    <Shell>
      <Link to="/cases" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <ArrowRight className="size-4" aria-hidden="true" />
        همه کیس‌ها
      </Link>
      <p className="mt-2 text-sm font-semibold text-amber">
        {item.tag} · {item.who}
      </p>
      <h1 className="mt-1 font-display text-4xl leading-none">{item.title}</h1>
      <p className="mt-4 rounded-card border border-line bg-panel p-5 leading-relaxed">{item.vignette}</p>
      <div className="mt-4 grid gap-2">
        {item.choices.map((choice, i) => {
          const correct = i === item.answer;
          let tone = "border-line bg-panel-2";
          if (revealed && correct) tone = "border-teal bg-teal text-teal-ink";
          else if (revealed && pick === i) tone = "border-rose bg-rose text-rose-ink";
          return (
            <button
              key={choice}
              type="button"
              disabled={revealed}
              onClick={() => choose(i)}
              className={"min-h-12 rounded-2xl border px-4 text-right font-medium disabled:cursor-default " + tone}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {revealed ? (
        <section className="mt-4 rounded-card border border-line bg-panel p-5">
          <h2 className="font-semibold">{pick === item.answer ? "درست خواندی" : "این یکی نه"}</h2>
          <p className="mt-2 leading-relaxed text-muted">{item.why}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {item.teach.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <Link
            to="/chapter/$id"
            params={{ id: item.chapterId }}
            className="mt-4 inline-flex min-h-11 items-center text-teal"
          >
            برو به فصل مرتبط
          </Link>
        </section>
      ) : null}
      <Disclaimer />
    </Shell>
  );
}
