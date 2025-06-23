import React from "react";

interface AppHeader {
  children: React.ReactNode;
}

export default function AppHeader({ children }: AppHeader) {
  return (
    <div>
      <h1 className="font-bold text-3xl text-center mb-8">{children}</h1>
    </div>
  );
}
