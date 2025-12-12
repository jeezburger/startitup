"use client";

import React from "react"; // ensure React is imported
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      <DottedSurface />  {/* background */}
      <div className="flex items-center justify-center h-[60vh] relative z-10">
        <h1 className="text-5xl font-semibold text-center text-white">
          What can I help you build?
        </h1>
      </div>
      <div className="w-full flex justify-center pb-18 relative z-10">
        <VercelV0Chat />
      </div>
    </main>

  );
}




