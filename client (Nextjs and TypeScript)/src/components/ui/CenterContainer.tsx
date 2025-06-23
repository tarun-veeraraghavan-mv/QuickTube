import React from "react";

interface CenterContainer {
  children: React.ReactNode;
}

export default function CenterContainer({ children }: CenterContainer) {
  return (
    <div className="absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[850px]">
      {children}
    </div>
  );
}
