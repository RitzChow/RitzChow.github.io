import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruizhe Zhou — Academic Portfolio",
  description:
    "Ruizhe Zhou's academic portfolio: research in physical AI, physics reasoning, and multimodal evaluation.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader cv={profile.cv} />
        {children}
      </body>
    </html>
  );
}
