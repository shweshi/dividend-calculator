import { ReactNode } from "react";

interface CardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function SimpleCard({ title, icon, children }: CardProps) {
  return (
    <div className="bg-[#1b1a21] p-4 rounded-xl border border-white/10">
      <div className="flex sm:flex-col gap-2 text-gray-300 sm:items-start  justify-between">
        <p className="text-sm">{title}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}
