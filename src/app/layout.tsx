import "@/styles/globals.css";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="border-b bg-white">
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-default.png" alt="Logo" className="h-8" />
              <span className="font-semibold">REFERTIMINI</span>
            </div>
            <div className="text-xs text-slate-500">Powered by Informatica Comense</div>
          </div>
        </div>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
