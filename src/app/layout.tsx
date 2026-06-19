import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SiteHeader } from "@/components/SiteHeader";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flight Search Aggregator",
  description: "Search, compare, and book flights.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <AntdRegistry>
          <Providers>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <footer className="border-t border-zinc-200 bg-white">
              <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-zinc-500 sm:px-6">
                iBoxSky — Fly your dream flights with us. All rights reserved.
              </div>
            </footer>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
