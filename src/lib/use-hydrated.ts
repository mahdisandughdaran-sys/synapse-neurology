import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress";

export function useHydratedProgress() {
  const [ready, setReady] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    let alive = true;
    const pending = useProgress.persist.rehydrate();
    void Promise.resolve(pending).finally(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { ready, progress };
}
