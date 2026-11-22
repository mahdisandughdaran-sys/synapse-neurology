import { createFileRoute, Link } from "@tanstack/react-router";
import { cases } from "@/data/cases";
import { Disclaimer, Shell } from "@/components/shell";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/cases/")({
  component: CasesPage,
  head: () => ({ meta: [{ title: "کیس‌بالینی | سیناپس" }] }),
});

function CasesPage() {
  const { ready, progress } = useHydratedProgress();
  return (
    <Shell>
      <p className="text-sm font-semibold text-teal">درمانگاه کاغذی</p>
      <h1 className="mt-1 font-display text-4xl leading-none md:text-5xl">ده کیس، یک تشخیص</h1>
      <p className="mt-3 max-w-2xl text-muted">
        شرح‌حال را بخوان و یکی از چهار گزینه را بزن. بعد دلیل و نکته آموزشی باز می‌شود. کیس‌ها ساخته شده‌اند، نه پرونده واقعی.
      </p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {cases.map((c) => {
          const solved = ready && progress.cases[c.id];
          return (
            <li key={c.id}>
              <Link
                to="/cases/$id"
                params={{ id: c.id }}
                className="flex min-h-32 flex-col justify-between rounded-card border border-line bg-panel p-4 hover:border-teal"
              >
                <span className="text-xs font-semibold text-amber">
                  {c.tag}
                  {solved ? " · حل شده" : ""}
                </span>
                <span>
                  <span className="mt-2 block text-lg font-semibold">{c.title}</span>
                  <span className="mt-1 block text-sm text-muted">{c.who}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Disclaimer />
    </Shell>
  );
}
