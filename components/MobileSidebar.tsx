"use client";

import { LayoutDashboard, Upload, Table, BarChart2, Brain, X, Menu } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function MobileSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Dimmed background */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sliding Menu */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-[#0f1116] border-r border-white/10 z-50 p-6 transition-transform duration-300 md:hidden",

          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xl font-bold">
            <span className="text-[#14ffec]">N</span>exus
          </div>

          <button onClick={() => setOpen(false)}>
            <X size={24} className="text-gray-300" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="space-y-4">
          <MobileItem setOpen={setOpen} href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <MobileItem setOpen={setOpen} href="/dashboard#upload" icon={Upload} label="Upload Dataset" />
          <MobileItem setOpen={setOpen} href="/dashboard#table" icon={Table} label="Table" />
          <MobileItem setOpen={setOpen} href="/dashboard#charts" icon={BarChart2} label="Charts" />
          <MobileItem setOpen={setOpen} href="/dashboard#insights" icon={Brain} label="Insights" />
        </nav>
      </aside>
    </>
  );
}

function MobileItem({
  href,
  icon: Icon,
  label,
  setOpen,
}: {
  href: string;
  icon: any;
  label: string;
  setOpen: (v: boolean) => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-300 hover:bg-white/5 hover:text-white transition"
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}
