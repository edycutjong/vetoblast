import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "VetoBlast — Zero-Trust AI Agent Command Interceptor",
  description:
    "A zero-trust runtime proxy that intercepts AI agent terminal commands, redacting secrets and vetoing malicious shell executions.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "VetoBlast — Zero-Trust AI Agent Command Interceptor",
    description:
      "Local-first security gateway protecting developer workspaces from AI agent credential leaks and destructive commands.",
    url: "https://vetoblast.edycu.dev",
    siteName: "VetoBlast",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "VetoBlast" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VetoBlast — Zero-Trust AI Agent Command Interceptor",
    description:
      "Local-first security gateway protecting developer workspaces from AI agent credential leaks.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
