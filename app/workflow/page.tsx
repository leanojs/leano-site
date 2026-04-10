import { WorkflowPage } from "@/components/page/WorkflowPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "GitHub Workflow",
  description:
    "Automatically optimize images in every pull request with the Leano GitHub Action. Detect changed files, convert in-place, commit optimized assets back.",
  path: "/workflow",
});

export default function Page() {
  return <WorkflowPage />;
}
