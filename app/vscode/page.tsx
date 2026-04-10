import { VsCodePage } from "@/components/page/VsCodePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "VS Code extension",
  description:
    "Optimize JPG and PNG images in VS Code and Cursor with the leano CLI. Explorer menus, command palette, local npx — no server or API keys.",
  path: "/vscode",
});

export default function Page() {
  return <VsCodePage />;
}
