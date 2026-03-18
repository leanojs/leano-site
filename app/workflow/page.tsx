import { WorkflowPage } from "@/components/page/WorkflowPage";

export const metadata = {
  title: "GitHub Workflow — Webpocalypse",
  description:
    "Automatically optimize images in every pull request with the Webpocalypse GitHub Action. Detect changed files, convert in-place, commit optimized assets back.",
};

export default function Page() {
  return <WorkflowPage />;
}
