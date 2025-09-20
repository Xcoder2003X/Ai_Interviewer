import type { Metadata } from "next";
import {  Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Prepare for PFE",
  description: "An AI-powerd platform to help you prepare for your interviews ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // only dark mode is supported
   
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className }  antialiased pattern`}
      >
        {children}
        <Toaster />
        <section className="bg-stars">
    <span className="star"></span>
    <span className="star"></span>
    <span className="star"></span>
    <span className="star"></span>
  </section>
      </body>
    </html>
  );
}
