import type { Metadata } from "next";
import { playfair, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pentae",
  description: "Jewelry ecommerce powered by elemental numerology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
