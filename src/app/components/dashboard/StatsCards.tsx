import {
  AlertTriangle,
  Calendar,
  CircleAlert,
  Clock,
  Users,
  Workflow,
} from "lucide-react";
import { StatCard } from "./StatCard";

const metrics = [
  {
    label: "Open Items",
    value: 0,
    icon: CircleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-50",
  },
  {
    label: "Active Workflows",
    value: 0,
    icon: Workflow,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-50",
  },
  {
    label: "Total Users",
    value: 0,
    icon: Users,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-50",
  },
  {
    label: "Pending Approvals",
    value: 0,
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-50",
  },
  {
    label: "Overdue Tasks",
    value: 0,
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-50",
  },
  {
    label: "Due This Week",
    value: 0,
    icon: Calendar,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-50",
  },
];

export function StatsCards() {
  return (
    <section>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Welcome back,</h1>
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  );
}
