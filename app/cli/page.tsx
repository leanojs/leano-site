import { CliPage } from "@/components/page/CliPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "CLI",
  description:
    "Batch convert images to WebP/AVIF from the terminal with the leano CLI. Fully local, no server, no API calls.",
  path: "/cli",
});

export default function Page() {
  return <CliPage />;
}
