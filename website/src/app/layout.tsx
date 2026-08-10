import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "System Design for AI — Free, from zero to production",
  description:
    "A free, open-source, beginner-to-expert curriculum covering how AI systems are actually designed and built. ML, GenAI, and Agentic AI system design, taught like a story.",
  keywords: [
    "system design",
    "AI",
    "ML",
    "LLM",
    "RAG",
    "agents",
    "free curriculum",
    "open source",
  ],
  authors: [{ name: "System Design for AI contributors" }],
  openGraph: {
    title: "System Design for AI",
    description:
      "System design for AI, taught like a story — free, from zero to production.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
