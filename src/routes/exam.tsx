import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { stations } from "@/data/exam-map";
import { Disclaimer, Shell } from "@/components/shell";
import { faNum } from "@/lib/format";

export const Route = createFileRoute("/exam")({
  component: ExamPage,
  head: () => ({ meta: [{ title: "معاینه عصبی | سیناپس" }] }),
});

function ExamPage() {
  const [open, setOpen] = useState(stations[0]?.id ?? "");

  return (
    <Shell>
      <p className="text-sm font-semibold text-teal">ایستگاه معاینه</p>
      <h1 className="mt-1 font-display text-4xl leading-none md:text-5xl">از مغز تا راه رفتن</h1>
      <p className="mt-3 max-w-2xl text-muted">
        هر ایستگاه را باز کن: چه بپرسی، کدام یافته غیرطبیعی است، و آن یافته کجا را لو می‌دهد.
        معاینه خوب یعنی الگو، نه فهرست حفظی.
      </p>
      <ol className="mt-6 space-y-3">
        {stations.map((s, i) => {
          const on = open === s.id;
          return (
            <li key={s.id} className="rounded-card border border-line bg-panel">
              <button
                type="button"
                className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-right"
                aria-expanded={on}
                onClick={() => setOpen(on ? "" : s.id)}
              >
                <span className="font-display text-2xl text-amber">{faNum(i + 1)}</span>
                <span className="flex-1 font-semibold">{s.title}</span>
                <span className="text-sm text-muted">{on ? "بستن" : "باز کردن"}</span>
              </button>
              {on ? (
                <div className="grid gap-4 border-t border-line p-4 md:grid-cols-3">
                  <Block title="چه کار کن" items={s.doThis} />
                  <Block title="یافته مهم" items={s.abnormal} />
                  <div>
                    <h2 className="text-sm font-semibold text-teal">کجا را نشان می‌دهد</h2>
                    <p className="mt-2 text-sm leading-relaxed">{s.localizes}</p>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <Disclaimer />
    </Shell>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-amber">{title}</h2>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
