import "./globals.css";
import React from "react";

export const metadata = { title: "AI Resume Generator", description: "MVP for SkillUp.Study" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <head>
        {domain ? (
          <script async defer data-domain={domain} src="https://plausible.io/js/script.js"></script>
        ) : null}
      </head>
      <body className="min-h-screen">
        <div className="max-w-5xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
