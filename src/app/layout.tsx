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

// export const metadata: Metadata = {
//   title: "Bhakti Bites",
//   description: "Mahaprasad made by ISKCON Devotees",
// };

// import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bhakti Bites - Satvik Snacks",
  description: "Healthy Mahaprasad cookies made with jaggery and wheat flour. Made by ISKCON Devotees",
  keywords: ["Satvik snacks", "gur cookies", "healthy sweets","Mahaprasad Cookies"],
  openGraph: {
    title: "Bhakti Bites",
    description: "Delicious Satvik cookies and sweets.",
    url: "https://bhaktibites.com",
    siteName: "Bhakti Bites",
    images: [
      {
        url: "/images/banner1.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhakti Bites",
    description: "Healthy Satvik snacks delivered fresh.",
    images: ["/images/banner1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
