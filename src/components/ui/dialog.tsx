import * as React from "react";

export function Dialog({ open, children }: any) {
  return open ? <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">{children}</div> : null;
}

export function DialogTrigger({ asChild, children, onClick }: any) {
  return React.cloneElement(children, { onClick });
}

export function DialogContent({ children }: any) {
  return (
    <div className="bg-white p-4 rounded-md shadow-lg w-96">
      {children}
    </div>
  );
}

export function DialogHeader({ children }: any) {
  return <div className="mb-2 border-b pb-1">{children}</div>;
}

export function DialogTitle({ children }: any) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}
