import { createFileRoute } from "@tanstack/react-router";
import { BookReader } from "@/components/reader";
import { Shell } from "@/components/shell";
import { leaves } from "@/data/leaves";

export const Route = createFileRoute("/read/$n")({
  component: ReadPage,
  head: ({ params }) => {
    const page = Number(params.n);
    const leaf = leaves[page - 1];
    return { meta: [{ title: `${leaf?.title ?? "برگ"} | سیناپس` }] };
  },
});

function ReadPage() {
  const { n } = Route.useParams();
  const page = Number(n);
  return (
    <Shell>
      <BookReader page={Number.isFinite(page) ? page : 0} />
    </Shell>
  );
}
