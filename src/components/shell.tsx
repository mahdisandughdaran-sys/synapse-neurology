import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, BookOpenText, Brain, ClipboardCheck, House } from "lucide-react";
import type { ReactNode } from "react";

const links = [
  { to: "/read", label: "کتاب", icon: BookOpenText, exact: false },
  { to: "/", label: "نقشه", icon: House, exact: true },
  { to: "/cases", label: "کیس", icon: Brain, exact: false },
  { to: "/quiz", label: "آزمون", icon: ClipboardCheck, exact: false },
  { to: "/review", label: "کارت", icon: BookOpen, exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-ink">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-teal text-teal-ink">
              <Brain className="size-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-2xl leading-none">سیناپس</span>
              <span className="text-xs text-muted">آزمایشگاه نورولوژی</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="اصلی">
            {links.map((l) => {
              const active = l.exact ? path === l.to : path === l.to || path.startsWith(`${l.to}/`);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold " +
                    (active ? "bg-teal text-teal-ink" : "text-muted hover:bg-panel hover:text-fg")
                  }
                >
                  <l.icon className="size-4" aria-hidden="true" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 md:pb-16">{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-ink md:hidden"
        aria-label="پایین صفحه"
      >
        {links.map((l) => {
          const active = l.exact ? path === l.to : path === l.to || path.startsWith(`${l.to}/`);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={
                "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold " +
                (active ? "text-teal" : "text-muted")
              }
            >
              <l.icon className="size-5" aria-hidden="true" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="mt-8 text-sm leading-relaxed text-muted">
      سیناپس بازنشر کتاب «درسنامه بیماری‌های مغز و اعصاب» (کمیته علمی انجمن مغز و اعصاب ایران، ویراست دوم)
      نیست. برگ‌ها بازنویسی آموزشی مستقل روی همان سرفصل‌های عمومی‌اند؛ نه کلید آزمون، نه پروتکل درمان.
      دوز دارو را از راهنمای به‌روز مرکز بگیر. علامت ناگهانی عصبی اورژانس است.
    </p>
  );
}
