"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileDock from "@/components/MobileDock";
import { BlurFade } from "@/components/ui/blur-fade";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#0f1116] min-h-screen text-white overflow-hidden">
      
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-x-hidden">

        {/* Navbar */}
        <Navbar />

        {/* PAGE CONTENT WRAPPER (FIXED FOR MOBILE) */}
        <main className="p-6 overflow-x-hidden">
          
          {/* Only fade the CONTENT, not the container */}
          <div className="max-w-full overflow-x-hidden">
            <BlurFade delay={0.15} className="w-full">
              {children}
            </BlurFade>
          </div>

        </main>

        {/* Mobile Floating Dock */}
        <MobileDock />

      </div>
    </div>
  );
}
