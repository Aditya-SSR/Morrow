import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = {
  title: "Morrow — Every future deserves a beginning",
  description:
    "Morrow is a foundation creating pathways to education, mentorship, and opportunity for the next generation. Based in Seoul, Korea.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
      <body className="bg-cream font-display text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

