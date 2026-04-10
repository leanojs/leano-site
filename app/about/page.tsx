import { AboutPage } from "@/components/page/AboutPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Leano is a suite of open tools that convert JPG and PNG images to modern formats — WebP and AVIF — fully locally, no uploads.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}
