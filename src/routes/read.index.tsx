import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Brain, Search } from "lucide-react";
import { chapters } from "@/data";
import { leaves, pagesOf } from "@/data/leaves";
import { chapterIcons } from "@/components/icons";
import { Disclaimer, Shell } from "@/components/shell";
import { faNum } from "@/lib/format";
import { useHydratedProgress } from "@/lib/use-hydrated";

export const Route = createFileRoute("/read/")({
  component: ReadShelf,
  head: () => ({ meta: [{ title: "دفتر برگ‌به‌برگ | سیناپس" }] }),
});

function ReadShelf() {
  const [q, setQ] = useState("");
  const { ready, progress } = useHydratedProgress();
  const bookmark = ready ? Math.min(Math.max(progress.bookmark || 1, 1), leaves.length) : 1;
  const seen = ready ? Object.keys(progress.leafSeen ?? {}).length : 0;
  const missed = ready
    ? Object.keys(progress.leafMiss ?? {})
        .filter((key) => progress.leafMiss?.[key])
        .map(Number)
        .sort((a, b) => a - b)
    : [];
  const here = leaves[bookmark - 1];

  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return chapters;
    return chapters.filter((chapter) => {
      if (chapter.title.includes(s) || chapter.en.toLowerCase().includes(s.toLowerCase())) return true;
      return pagesOf(chapter.id).some((item) => item.leaf.title.includes(s) || item.leaf.lead.includes(s));
    });
  }, [q]);

  return (
    <Shell>
      <section className="rounded-card border border-line bg-panel p-5 md:p-8">
        <p className="text-sm font-semibold text-teal">دفتر مطالعه · ویراست آموزشی مستقل</p>
        <h1 className="mt-2 font-display text-5xl leading-none md:text-6xl">صفحه به صفحه، با توقف برای فهمیدن</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          {faNum(leaves.length)} صفحه به ترتیب بیست‌وسه فصل درسنامه بیماری‌های مغز و اعصاب (کمیته علمی انجمن،
          ویراست دوم). هر صفحه چند قدم درس است و با یک سؤال بسته می‌شود. جای متن چاپی کتاب را نمی‌گیرد.
        </p>
        <Link
          to="/read/$n"
          params={{ n: String(bookmark) }}
          className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-teal px-5 font-semibold text-teal-ink"
        >
          {bookmark <= 1 ? "شروع از صفحه اول" : `ادامه از صفحه ${faNum(bookmark)}`}
          {here ? ` · ${here.title}` : ""}
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <p className="mt-3 text-sm text-muted">
          {faNum(seen)} از {faNum(leaves.length)} صفحه سنجیده شده
          {missed.length ? ` · ${faNum(missed.length)} صفحه غلط` : ""}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full bg-teal"
            style={{ width: `${leaves.length ? Math.round((seen / leaves.length) * 100) : 0}%` }}
          />
        </div>
        {missed[0] ? (
          <Link
            to="/read/$n"
            params={{ n: String(missed[0]) }}
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-rose px-4 text-sm font-semibold text-rose-ink"
          >
            مرور صفحه‌های غلط
          </Link>
        ) : null}
      </section>

      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جست‌وجوی فصل یا عنوان برگ"
          className="min-h-12 w-full rounded-full border border-line bg-panel pr-12 pl-4 text-fg outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
        />
      </label>

      <div className="mt-4 space-y-3">
        {filtered.map((chapter) => {
          const Icon = chapterIcons[chapter.id] ?? Brain;
          const pages = pagesOf(chapter.id);
          const readCount = ready ? pages.filter((item) => progress.leafSeen?.[String(item.page)]).length : 0;
          return (
            <section key={chapter.id} className="rounded-card border border-line bg-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-panel-2 text-teal">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-semibold">
                      {faNum(chapter.n)}. {chapter.title}
                    </h2>
                    <p className="text-sm text-muted">
                      {faNum(readCount)} از {faNum(pages.length)} برگ
                    </p>
                  </div>
                </div>
                <Link
                  to="/read/$n"
                  params={{ n: String(pages[0]?.page ?? 1) }}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-3 text-sm font-semibold"
                >
                  باز کن
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {pages.map((item) => {
                  const read = ready && progress.leafSeen?.[String(item.page)];
                  const wrong = ready && progress.leafMiss?.[String(item.page)];
                  return (
                    <Link
                      key={item.page}
                      to="/read/$n"
                      params={{ n: String(item.page) }}
                      className={
                        "inline-flex min-h-11 items-center rounded-full border px-3 text-sm " +
                        (wrong ? "border-rose text-fg" : read ? "border-teal text-fg" : "border-line text-muted")
                      }
                    >
                      {item.leaf.title}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-panel p-4 text-muted">برگی با این عبارت پیدا نشد.</p>
      ) : null}
      <Disclaimer />
    </Shell>
  );
}
