import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import GlobalModals from "@/components/GlobalModals";
import LiveNewsTicker from "@/components/LiveNewsTicker";
import ChatAssistant from "@/components/ChatAssistant";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bharat Nirvachan - Voter Journey Guide",
  description: "Official Election Information Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LiveNewsTicker />
        <LanguageProvider>
          <AuthProvider>
            <GlobalModals />
            {children}
            <ChatAssistant />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
