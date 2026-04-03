"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function MobileDock() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const items = [
    { title: "Home", href: "/dashboard", icon: "🏠" },
    { title: "Table", href: "/datatable", icon: "📊" },
    { title: "Charts", href: "/charts", icon: "📈" },
    { title: "AI", href: "/insights", icon: "✨" },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[999] md:hidden">
      <div className="
        flex items-end gap-3 
        bg-[#0d1016]/80 backdrop-blur-xl 
        px-6 py-3 rounded-3xl border border-white/10 shadow-2xl
      ">
        {items.map((item, index) => {
          const isHover = hoverIndex === index;
          const isNear = hoverIndex !== null && Math.abs(hoverIndex - index) === 1;

          return (
            <Link
              key={item.title}
              href={item.href}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className="flex flex-col items-center"
            >
              <div
                className={cn(
                  "transition-all duration-200 flex items-center justify-center rounded-full bg-[#1a1d24]",
                  "text-xl",
                  isHover ? "scale-150 p-3" : isNear ? "scale-110 p-2.5" : "scale-100 p-2"
                )}
              >
                {item.icon}
              </div>
              <span className="text-[10px] mt-1 text-gray-300">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
