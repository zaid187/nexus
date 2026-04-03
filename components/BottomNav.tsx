"use client";

import Link from "next/link";
import { LayoutDashboard, Table, BarChart3, Sparkles } from "lucide-react";

export default function BottomNav() {
  const items = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/datatable", icon: Table, label: "Table" },
    { href: "/charts", icon: BarChart3, label: "Charts" },
    { href: "/insights", icon: Sparkles, label: "AI" },
  ];

  return (
    <div className="
      fixed bottom-0 left-0 right-0 md:hidden 
      bg-[#0d0f15]/70 backdrop-blur-xl 
      border-t border-white/10
      flex justify-around py-3
      z-50
    ">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center text-gray-300 hover:text-[#14ffec]"
        >
          <item.icon size={22} />
          <span className="text-[10px] mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
