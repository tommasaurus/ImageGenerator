"use client";

import { usePathname } from "next/navigation";

export function PageRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <body
      data-page={pathname === "/" ? "home" : ""}
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors"
    >
      {children}
    </body>
  );
}
