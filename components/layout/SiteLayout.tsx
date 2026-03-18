"use client";

import type { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="z-10 relative flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
