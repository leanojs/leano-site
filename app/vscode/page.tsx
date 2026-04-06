import { VsCodePage } from "@/components/page/VsCodePage";

export const metadata = {
  title: "VS Code extension — Leano",
  description:
    "Optimize JPG and PNG images in VS Code and Cursor with the leano CLI. Explorer menus, command palette, local npx — no server or API keys.",
};

export default function Page() {
  return <VsCodePage />;
}
