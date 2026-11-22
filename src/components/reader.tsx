import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { chapterOfPage, leaves, pagesOf } from "@/data/leaves";
import { chapters } from "@/data";
import { chapterIcons } from "@/components/icons";
import { faNum } from "@/lib/format";
import { useHydratedProgress } from "@/lib/use-hydrated";
import type { Leaf } from "@/data/leaves-types";

function lessonBeats(leaf: Leaf) {
  const parts = leaf.body.split(/(?<=[.؟!])\s+/).filter(Boolean);
  const lesson =
    parts.length < 3
      ? [leaf.body]
      : [
          parts.slice(0, Math.ceil(parts.length / 2)).join(" "),
          parts.slice(Math.ceil(parts.length / 2)).join(" "),
        ];
  return [
    { k: "هدف این صفحه", text: leaf.lead },
    ...lesson.map((text, index) => ({
      k: lesson.length > 1 ? `درس ${faNum(index + 1)}` : "درس",
      text,
    })),
    { k: "حاشیه امتحان", text: leaf.note },
  ];
}

export function BookReader({ page }: { page: number }) {
  const leaf = leaves[page - 1];
  const navigate = useNavigate();
  const { ready, progress } = useHydratedProgress();
  const [openToc, setOpenToc] = useState(false);
  const [beat, setBeat] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const setBookmark = progress.setBookmark;
  const beats = leaf ? lessonBeats(leaf) : [];
  const taught = beat >= beats.length - 1;
  const answered = pick !== null;

  useEffect(() => {
    if (!ready || !leaf) return;
    setBookmark(page);
  }, [ready, page, leaf, setBookmark]);

  useEffect(() => {
    setBeat(0);
    setPick(null);
    setOpenToc(false);
  }, [page]);

  function go(next: number) {
    if (next < 1 || next > leaves.length) return;
    void navigate({ to: "/read/$n", params: { n: String(next) } });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowLeft") {
        if (beat < beats.length - 1) setBeat((value) => value + 1);
        else if (pick !== null && page < leaves.length) {
          void navigate({ to: "/read/$n", params: { n: String(page + 1) } });
        }
      }
      if (event.key === "ArrowRight" && page > 1) {
        void navigate({ to: "/read/$n", params: { n: String(page - 1) } });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beat, beats.length, navigate, page, pick]);

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
  const missed = ready && progress.leafMiss?.[String(page)];
  const Icon = chapter ? chapterIcons[chapter.id] : undefined;
  const lastOfChapter = localIndex === inChapter.length - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          صفحه {faNum(page)} از {faNum(leaves.length)}
          {chapter ? ` · فصل ${faNum(chapter.n)}` : ""}
          {ready ? ` · ${faNum(seen)} سنجیده شده` : ""}
        </p>
        <button
          type="button"
          onClick={() => setOpenToc((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-semibold"
        >
          <Bookmark className="size-4 text-amber" aria-hidden="true" />
          فهرست همین کتاب
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
                  const wrong = ready && progress.leafMiss?.[String(itemPage.page)];
                  return (
                    <Link
                      key={itemPage.page}
                      to="/read/$n"
                      params={{ n: String(itemPage.page) }}
                      className={
                        "inline-flex min-h-11 items-center rounded-full border px-3 text-sm " +
                        (active
                          ? "border-teal bg-teal text-teal-ink"
                          : wrong
                            ? "border-rose text-fg"
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

      <article className="relative overflow-hidden rounded-card border border-paper-line bg-paper text-paper-ink">
        <div className="absolute inset-y-0 right-0 w-2 bg-teal" aria-hidden="true" />
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <header className="border-b border-paper-line pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stamp">
                  {chapter
                    ? `${chapter.title} · صفحه ${faNum(localIndex + 1)} از ${faNum(inChapter.length)} این فصل`
                    : "سیناپس"}
                </p>
                <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">{leaf.title}</h1>
              </div>
              {Icon ? (
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper-line text-stamp">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
              ) : null}
            </div>
            <ol className="mt-4 flex flex-wrap gap-2" aria-label="قدم‌های این صفحه">
              {beats.map((item, index) => {
                const on = index <= beat;
                return (
                  <li
                    key={item.k}
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold " +
                      (on ? "bg-teal text-teal-ink" : "bg-paper-line text-paper-muted")
                    }
                  >
                    {faNum(index + 1)} {item.k}
                  </li>
                );
              })}
              <li
                className={
                  "rounded-full px-3 py-1 text-xs font-semibold " +
                  (taught ? "bg-amber text-amber-ink" : "bg-paper-line text-paper-muted")
                }
              >
                {faNum(beats.length + 1)} بسنج
              </li>
            </ol>
            {missed ? <p className="mt-3 text-sm font-semibold text-stamp">این صفحه را دفعه قبل غلط زدی. یک بار دیگر.</p> : null}
          </header>

          <div className="mt-5 space-y-4">
            {beats.slice(0, beat + 1).map((item) => (
              <section key={item.k}>
                <h2 className="text-xs font-semibold text-stamp">{item.k}</h2>
                <p className={"mt-1 leading-relaxed " + (item.k === "هدف این صفحه" ? "text-lg font-semibold" : "text-paper-muted")}>
                  {item.text}
                </p>
              </section>
            ))}
          </div>

          {!taught ? (
            <button
              type="button"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-teal px-5 font-semibold text-teal-ink"
              onClick={() => setBeat((value) => Math.min(beats.length - 1, value + 1))}
            >
              قدم بعد درس
            </button>
          ) : (
            <LeafCheck
              page={page}
              pick={pick}
              onPick={(index) => {
                setPick(index);
                progress.markLeafResult(String(page), index === leaf.answer);
              }}
            />
          )}

          {answered && lastOfChapter && chapter ? (
            <p className="mt-5 rounded-2xl border border-paper-line bg-paper-line px-4 py-3 text-sm leading-relaxed">
              فصل «{chapter.title}» در دفتر تمام شد. اگر خواستی همین‌جا جمع‌بندی و کارت‌های فصل را باز کن.{" "}
              <Link to="/chapter/$id" params={{ id: chapter.id }} className="font-semibold text-stamp">
                برو به فصل
              </Link>
            </p>
          ) : null}
        </div>
      </article>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {page > 1 ? (
          <button
            type="button"
            onClick={() => go(page - 1)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-panel font-semibold"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            صفحه قبل
          </button>
        ) : (
          <span />
        )}
        {page < leaves.length ? (
          <button
            type="button"
            disabled={!answered}
            onClick={() => go(page + 1)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal font-semibold text-teal-ink disabled:opacity-40"
          >
            صفحه بعد
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <Link
            to="/quiz"
            className={
              "inline-flex min-h-12 items-center justify-center rounded-full bg-amber font-semibold text-amber-ink " +
              (answered ? "" : "pointer-events-none opacity-40")
            }
          >
            دفتر تمام شد · آزمون
          </Link>
        )}
      </div>
      {page < leaves.length && !answered ? (
        <button type="button" onClick={() => go(page + 1)} className="mt-3 text-sm text-muted">
          بدون سنجیدن رد شو
        </button>
      ) : (
        <p className="mt-3 text-sm text-muted">فلش چپ قدم بعد یا صفحه بعد است. فلش راست برمی‌گردد.</p>
      )}
    </div>
  );
}

function LeafCheck({
  page,
  pick,
  onPick,
}: {
  page: number;
  pick: number | null;
  onPick: (index: number) => void;
}) {
  const leaf = leaves[page - 1];
  if (!leaf) return null;
  const open = pick !== null;

  return (
    <section className="mt-6 border-t border-paper-line pt-5">
      <h2 className="text-base font-semibold">خودت را همین صفحه بسنج</h2>
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
              onClick={() => onPick(index)}
              className={"min-h-12 rounded-2xl border px-4 text-right leading-relaxed " + tone}
            >
              <span className="flex items-center justify-between gap-3">
                <span>{option}</span>
                {open && correct ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
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
