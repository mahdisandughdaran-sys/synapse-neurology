import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Brain } from "lucide-react";
import { aminoffChapters } from "@/data/aminoff-track";
import { chapterIcons } from "@/components/icons";
import { Shell } from "@/components/shell";
import { faNum } from "@/lib/format";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/aminoff/")({
  component: AminoffIndex,
  head: () => ({ meta: [{ title: "روش بالینی | سیناپس" }] }),
});

function AminoffIndex() {
  const { ready, progress } = useHydratedProgress();
  const done = aminoffChapters.filter((c) => ready && progress.done[c.id]).length;

  return (
    <Shell>
      <p className="text-sm font-semibold text-amber">مسیر جدا · کنار بیست‌وسه فصل</p>
      <h1 className="mt-1 font-display text-4xl leading-none md:text-5xl">
        صد صفحهٔ اول روش بالینی
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        دوازده درس فشرده: شرح حال، معاینه عمومی، شناخت و زبان، اعصاب جمجه‌ای، حرکت و حس، فرمولاسیون،
        مایع مغزی، برق عصبی، تصویر و نمونه، معاینه کما، علت‌های کما، و درِ حالات کنفوزیونی. متن هیچ
        کتابی بازنشر نشده و شکل و جدول بازسازی نشده است.
      </p>
      <p className="mt-3 text-sm text-muted">
        {faNum(done)} از {faNum(aminoffChapters.length)} درس علامت خورده
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {aminoffChapters.map((c) => {
          const Icon = chapterIcons[c.id] ?? Brain;
          const marked = ready && progress.done[c.id];
          return (
            <li key={c.id}>
              <Link
                to="/aminoff/$id"
                params={{ id: c.id }}
                className="flex min-h-36 flex-col justify-between rounded-card border border-line bg-panel p-4 hover:border-teal"
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
                    {marked ? " · تمام شده" : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-sm leading-relaxed text-muted">
        یادداشت آموزشی مستقل است، نه بازنشر «نورولوژی بالینی» و نه پروتکل درمان. دوز را از راهنمای
        جاری مرکز بگیر. افت ناگهانی هوشیاری اورژانس است. ادامه کنفوزیون، دمانس و فصل‌های بعدی در این
        مسیر نیست.
      </p>
      <Link to="/" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-teal">
        برگشت به نقشه بیست‌وسه فصل
        <ArrowLeft className="size-4" aria-hidden="true" />
      </Link>
    </Shell>
  );
}
