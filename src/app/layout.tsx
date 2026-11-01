import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Oxygen, Poppins } from "next/font/google";
import "./globals.css";
import ProviderWrapper from "../store/ProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});
const plans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plans",
  display: "swap",
});
const oxygen = Oxygen({
  subsets: ["latin"],
  weight: ["400"], // Regular
  variable: "--font-oxygen",
});
export const metadata: Metadata = {
  title: "Mejarc",
  description: "Premium design solutions, powered by trusted expertise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}  ${plans.variable} antialiased ${oxygen.variable} font-oxygen`}
      >
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
