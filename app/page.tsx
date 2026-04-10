import type { Metadata } from "next";
import { HomePage } from "@/components/page/HomePage";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
