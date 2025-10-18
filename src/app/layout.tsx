import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "RefertiMini – powered by Informatica Comense",
  description: "Sistema referti elettronici per il minibasket.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo-default.png"
                alt="Logo RefertiMini"
                className="h-8 w-auto"
              />
              <span className="font-semibold tracking-wide text-slate-800">
                REFERTIMINI
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Powered by Informatica Comense
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}

