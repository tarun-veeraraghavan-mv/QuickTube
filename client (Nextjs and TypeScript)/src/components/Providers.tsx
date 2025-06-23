"use client";

import React, { useState } from "react";
import AppToaster from "./ui/AppToaster";
import Navbar from "./Navbar";
import { AuthProvider } from "@/utils/AuthContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <AppToaster />
      <div>
        <Navbar />
        <div>{children}</div>
      </div>
    </AuthProvider>
  );
}
