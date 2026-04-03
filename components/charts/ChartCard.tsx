"use client";

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
      <h3 className="text-lg font-semibold text-[#14ffec] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

