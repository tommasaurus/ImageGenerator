import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { PageRoot } from "@/components/page-root";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ImageMart",
  description: "Transform your ideas into stunning images with ImageMart",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PageRoot>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </PageRoot>
    </html>
  );
}
