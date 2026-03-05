import { LucideIcon } from "lucide-react";
import { Card } from "../common/Card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
}: StatCardProps) {
  return (
    <Card className="min-w-0 h-full rounded-lg border border-[#E5E7EB] p-4 shadow-sm gap-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 truncate text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
