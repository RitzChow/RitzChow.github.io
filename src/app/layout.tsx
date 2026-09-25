import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

import { SiteHeader } from "@/components/site-header";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruizhe Zhou — Academic Portfolio",
  description:
    "Ruizhe Zhou's academic portfolio: research in Physical Intelligence, Visual Intelligence, and Multimodal systems.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader cv={profile.cv} />
        {children}

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ynsldgxm7q");
          `}
        </Script>
      </body>
    </html>
  );
}