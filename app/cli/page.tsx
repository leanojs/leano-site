import { CliPage } from "@/components/page/CliPage";

export const metadata = {
  title: "CLI — Webpocalypse",
  description:
    "Batch convert images to WebP/AVIF from the terminal with the webpocalypse CLI. Fully local, no server, no API calls.",
};

export default function Page() {
  return <CliPage />;
}
