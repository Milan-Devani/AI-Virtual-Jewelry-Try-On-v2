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
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: "14px",
              border: "1px solid #E2DBD1",
              background: "#FFFFFF",
              color: "#1A1715",
              fontSize: "13px",
              fontWeight: "500",
              boxShadow: "0 10px 25px -4px rgba(26, 23, 21, 0.1), 0 4px 10px -2px rgba(26, 23, 21, 0.05)",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
