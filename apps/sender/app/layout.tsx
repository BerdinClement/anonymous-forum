import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anonymous Forum - Sender",
  description: "Create and send anonymous messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Expose runtime env to the browser. This reads server-side process.env at runtime
            (works when Next is run as a Node server) and writes a small script that the
            client can read via window.__ENV. Terraform/docker will pass NEXT_PUBLIC_API_URL
            to the container and the server will include it here. */}
        <script
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
