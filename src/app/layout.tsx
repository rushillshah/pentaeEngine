import type { Metadata } from "next";
import { playfair, inter } from "./fonts";
import { AuthProvider } from "./components/AuthContext";
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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
