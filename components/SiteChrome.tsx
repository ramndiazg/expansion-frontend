"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const esPanelAdmin = pathname?.startsWith("/admin");

  if (esPanelAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
}