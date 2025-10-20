import * as React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border border-gray-300 rounded-md px-2 py-1 w-full focus:ring focus:ring-blue-200 ${className}`}
      {...props}
    />
  );
}
