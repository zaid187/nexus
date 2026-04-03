"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Upload,
  Table,
  BarChart3,
  Sparkles
} from "lucide-react";

export default function Sidebar() {
  const items = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Dataset", href: "/dashboard#upload", icon: Upload },
    { name: "Table", href: "/datatable", icon: Table },
    { name: "Charts", href: "/charts", icon: BarChart3 },
    { name: "Insights", href: "/insights", icon: Sparkles },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0f1116] border-r border-gray-800 py-10 px-6">

      {/* ---------- TITLE (CENTERED LEFT) ---------- */}
   <h1 className="text-2xl font-semibold tracking-wide mb-10 pl-2">
  <span className="text-[#14ffec]">N</span>
  <span className="text-white">exus</span>
</h1>



      {/* ---------- NAVIGATION ---------- */}
      <nav className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="
              flex items-center gap-3
              px-3 py-2
              rounded-md
              text-gray-300
              hover:bg-white/10 
              hover:text-white 
              transition
            "
          >
            <item.icon size={20} />
            <span className="text-[15px]">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
