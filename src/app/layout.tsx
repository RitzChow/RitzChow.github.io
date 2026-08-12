import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruizhe Zhou — Academic Portfolio",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader cv={profile.cv} />
        {children}
      </body>
    </html>
  );
}
