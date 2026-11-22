import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { chapterOfPage, leaves, pagesOf } from "@/data/leaves";
import { chapters } from "@/data";
import { chapterIcons } from "@/components/icons";
import { faNum } from "@/lib/format";
import { useHydratedProgress } from "@/lib/use-hydrated";

export function BookReader({ page }: { page: number }) {
  const leaf = leaves[page - 1];
  const navigate = useNavigate();
  const { ready, progress } = useHydratedProgress();
  const [openToc, setOpenToc] = useState(false);
  const setBookmark = progress.setBookmark;

  useEffect(() => {
    if (!ready || !leaf) return;
    setBookmark(page);
  }, [ready, page, leaf, setBookmark]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowLeft" && page < leaves.length) {
        void navigate({ to: "/read/$n", params: { n: String(page + 1) } });
      }
      if (event.key === "ArrowRight" && page > 1) {
        void navigate({ to: "/read/$n", params: { n: String(page - 1) } });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, navigate]);

  if (!leaf) {
    return (
      <p className="rounded-card border border-line bg-panel p-6">
        این برگ در دفتر نیست.{" "}
        <Link to="/read/$n" params={{ n: "1" }} className="text-teal">
          برو برگ اول
        </Link>
      </p>
    );
  }

  const chapter = chapterOfPage(page);
  const inChapter = chapter ? pagesOf(chapter.id) : [];
  const localIndex = inChapter.findIndex((item) => item.page === page);
  const seen = ready ? Object.keys(progress.leafSeen ?? {}).length : 0;
  const Icon = chapter ? chapterIcons[chapter.id] : undefined;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          برگ {faNum(page)} از {faNum(leaves.length)}
          {chapter ? ` · فصل ${faNum(chapter.n)}` : ""}
          {ready ? ` · ${faNum(seen)} برگ خوانده‌شده` : ""}
        </p>
        <button
          type="button"
          onClick={() => setOpenToc((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-semibold"
        >
          <Bookmark className="size-4 text-amber" aria-hidden="true" />
          فهرست برگ‌ها
        </button>
      </div>

      {openToc ? (
        <div className="mb-4 max-h-80 overflow-auto rounded-card border border-line bg-panel p-3">
          {chapters.map((item) => (
            <div key={item.id} className="border-b border-line py-2 last:border-b-0">
              <p className="text-sm font-semibold">
                {faNum(item.n)}. {item.title}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pagesOf(item.id).map((itemPage) => {
                  const active = itemPage.page === page;
                  const read = ready && progress.leafSeen?.[String(itemPage.page)];
                  return (
                    <Link
                      key={itemPage.page}
                      to="/read/$n"
                      params={{ n: String(itemPage.page) }}
                      onClick={() => setOpenToc(false)}
                      className={
                        "inline-flex min-h-11 items-center rounded-full border px-3 text-sm " +
                        (active
                          ? "border-teal bg-teal text-teal-ink"
                          : read
                            ? "border-line bg-panel-2 text-fg"
                            : "border-line text-muted")
                      }
                    >
                      {faNum(itemPage.page)} {itemPage.leaf.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <article className="relative overflow-hidden rounded-card border border-paper-line bg-paper text-paper-ink shadow-none">
        <div className="absolute inset-y-0 right-0 w-2 bg-teal" aria-hidden="true" />
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <header className="flex items-start justify-between gap-4 border-b border-paper-line pb-4">
            <div>
              <p className="text-sm font-semibold text-stamp">
                {chapter ? `${chapter.title} · برگ ${faNum(localIndex + 1)} از ${faNum(inChapter.length)}` : "سیناپس"}
              </p>
              <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">{leaf.title}</h1>
            </div>
            {Icon ? (
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper-line text-stamp">
                <Icon className="size-6" aria-hidden="true" />
              </span>
            ) : null}
          </header>

          <p className="mt-5 text-lg leading-relaxed font-semibold">{leaf.lead}</p>
          <p className="mt-3 leading-relaxed text-paper-muted">{leaf.body}</p>

          <aside className="mt-5 rounded-2xl border border-paper-line bg-paper-line px-4 py-3">
            <p className="text-xs font-semibold text-stamp">حاشیه برگ</p>
            <p className="mt-1 leading-relaxed">{leaf.note}</p>
          </aside>

          <LeafCheck key={page} page={page} />
        </div>
      </article>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {page > 1 ? (
          <Link
            to="/read/$n"
            params={{ n: String(page - 1) }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-panel font-semibold"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            برگ قبل
          </Link>
        ) : (
          <span />
        )}
        {page < leaves.length ? (
          <Link
            to="/read/$n"
            params={{ n: String(page + 1) }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal font-semibold text-teal-ink"
          >
            برگ بعد
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            to="/quiz"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber font-semibold text-amber-ink"
          >
            دفتر تمام شد · آزمون
          </Link>
        )}
      </div>
      <p className="mt-3 text-sm text-muted">با فلش چپ برگ بعد و با فلش راست برگ قبل را باز کن.</p>
    </div>
  );
}

function LeafCheck({ page }: { page: number }) {
  const leaf = leaves[page - 1];
  const { progress } = useHydratedProgress();
  const [pick, setPick] = useState<number | null>(null);
  if (!leaf) return null;
  const open = pick !== null;

  return (
    <section className="mt-6 border-t border-paper-line pt-5">
      <h2 className="text-base font-semibold">خودت را همین‌جا بسنج</h2>
      <p className="mt-2 leading-relaxed">{leaf.q}</p>
      <div className="mt-3 grid gap-2">
        {leaf.options.map((option, index) => {
          const chosen = pick === index;
          const correct = index === leaf.answer;
          let tone = "border-paper-line bg-paper text-paper-ink";
          if (open && correct) tone = "border-teal bg-paper text-paper-ink";
          else if (open && chosen) tone = "border-stamp bg-paper text-paper-ink";
          return (
            <button
              key={option}
              type="button"
              disabled={open}
              onClick={() => {
                setPick(index);
                progress.markLeaf(String(page));
              }}
              className={"min-h-12 rounded-2xl border px-4 text-right leading-relaxed " + tone}
            >
              <span className="flex items-center justify-between gap-3">
                <span>{option}</span>
                {open && correct ? <Check className="size-4 shrink-0 text-teal-ink" aria-hidden="true" /> : null}
                {open && chosen && !correct ? <X className="size-4 shrink-0 text-stamp" aria-hidden="true" /> : null}
              </span>
            </button>
          );
        })}
      </div>
      {open ? <p className="mt-3 text-sm leading-relaxed text-paper-muted">{leaf.why}</p> : null}
    </section>
  );
}
