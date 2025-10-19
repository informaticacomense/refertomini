import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "REFERTIMINI",
  description: "Area riservata referti minibasket"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-200">
        <div className="border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-default.png" alt="Logo" className="h-8" />
              <span className="font-semibold text-blue-800">REFERTIMINI</span>
            </div>
            <div className="text-xs text-slate-600">Powered by Informatica Comense</div>
          </div>
        </div>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
