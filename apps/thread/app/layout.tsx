import React from 'react';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anonymous Forum",
  description: "A simple anonymous forum where users can post and read messages using a unique pseudonym without any authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          // Expose runtime env to the browser for client code to read at runtime
          dangerouslySetInnerHTML={{
            __html: `window.__ENV = ${JSON.stringify({
              NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
            })}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
