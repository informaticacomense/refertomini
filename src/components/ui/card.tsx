import * as React from "react";

export function Card({ children, className = "" }: any) {
  return <div className={`rounded-lg border p-4 shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: any) {
  return <div className={`mb-2 flex justify-between items-center ${className}`}>{children}</div>;
}

export function CardTitle({ children }: any) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function CardContent({ children }: any) {
  return <div>{children}</div>;
}
