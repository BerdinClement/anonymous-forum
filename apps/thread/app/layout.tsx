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
        {children}
      </body>
    </html>
  );
}
