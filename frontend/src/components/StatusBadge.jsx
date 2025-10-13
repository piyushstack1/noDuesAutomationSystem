import { cn } from "@/lib/utils"

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  "query-raised": {
    label: "Query Raised",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  resolved: {
    label: "Resolved",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
}

export default function StatusBadge({ status, className, ...props }) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        config.className,
        className
      )}
      {...props}
    >
      {config.label}
    </span>
  )
}
