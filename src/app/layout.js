import { Geist, Geist_Mono } from "next/font/google";
import NavBarClient from "./NavBarClient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WiyoRent Student Referral Portal",
  description: "Participate in WiyoRent's referral program — invite landlords and win exciting rewards while helping students find trusted housing in Kigali.",
  openGraph: {
    title: "WiyoRent Student Referral Portal",
    description: "Refer landlords, earn rewards, and support student housing in Kigali with WiyoRent.",
    url: "https://www.wiyorent.com",
    siteName: "WiyoRent",
    images: [
      {
        url: "https://www.wiyorent.com/logo.png",
        width: 800,
        height: 600,
        alt: "WiyoRent Logo",
      },
    ],
    locale: "en_RW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WiyoRent Student Referral Portal",
    description: "Join the WiyoRent referral program and help connect students to trusted housing options in Kigali.",
    images: ["https://www.wiyorent.com/logo.png"],
  },
  icons: {
    icon: "/WiyoRent_logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBarClient />
        {children}
      </body>
    </html>
  );
}
