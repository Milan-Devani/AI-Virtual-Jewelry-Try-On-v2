import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI Jewelry Virtual Try-On | JEWELAI",
  description:
    "Create realistic jewelry try-on images using AI. Upload your model and jewelry product to generate premium e-commerce imagery in seconds with Gemini neural vision.",
  openGraph: {
    title: "JEWELAI — AI Jewelry Virtual Try-On",
    description: "Production-ready AI Jewelry Virtual Try-On for luxury jewelry e-commerce.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans selection:bg-[#EBDDC8] selection:text-[#1A1715]">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
