import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/read")({
  component: ReadLayout,
});

function ReadLayout() {
  return <Outlet />;
}
