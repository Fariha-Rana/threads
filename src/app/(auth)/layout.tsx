import { ClerkProvider } from "@clerk/nextjs"
import "../globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Threads",
  description: "Twiiter Competitor"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <ClerkProvider>
            <html lang="en">
            <body className={`${inter.className} bg-dark-1`}>
                { children }
                </body>
            </html>
        </ClerkProvider>
  );
}

