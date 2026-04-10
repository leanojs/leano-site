import { PrivacyPage } from "@/components/page/PrivacyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Leano's privacy policy. Your images never leave your browser. We use Vercel Analytics for anonymous usage data only.",
  path: "/privacy",
});

export default function Page() {
  return <PrivacyPage />;
}
