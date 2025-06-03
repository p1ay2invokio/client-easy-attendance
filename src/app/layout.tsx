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
  title: "EasyAttendance",
  description: "ระบบเวลาเข้าออกงาน",
  icons: '/box.png'
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


// https://vetcheckinapi.vet.cmu.ac.th/api/datetime/end/date?data=U2FsdGVkX18NJSQ82KGVUnSU1bzHOytqH%2Fmbg8gQFHJGFqti1pP3aX7kMHPfONDSR9jyfhBm6%2BRshl0OdiDYzqomA0I9Qpmh3Q2RCLymu8a6B%2FSDVoUOwi8ojzcV7GD5ERbGTln7WaN%2Bz4gPCAzbkM76lbySUnLj2WePsrIUi0I0k5pJYVkDGcD15Sbk%2BKnqw58ibj0q%2BQfK4jlWlHLLxlmPOIciOljlhkUBFdtXevAEcrLvBC2fJo5Jb1zs033dccmOWxCarzKRCPszzN%2BvlrvAmTUrqrRtHJIz6yTjAD%2FSr6myUZ0mCfMS17dAaTlveQCJCHh52hQ5dGLWrs92lDVWwI11r34LVtCjMavo5O3F2J%2BxZnzAJR%2FirMZNRbSRAnE3qpj4zKFVe9i37LGwfNFwy%2BXfcb1gTf%2B36ygJs17d2sUtLm6GTJYFd8vq0EAc
