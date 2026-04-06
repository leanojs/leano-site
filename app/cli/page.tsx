import { CliPage } from "@/components/page/CliPage";

export const metadata = {
  title: "CLI — Leano",
  description:
    "Batch convert images to WebP/AVIF from the terminal with the leano CLI. Fully local, no server, no API calls.",
};

export default function Page() {
  return <CliPage />;
}
