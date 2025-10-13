import { motion } from "framer-motion"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import StatusBadge from "./StatusBadge"

const unitIcons = {
  Department: CheckCircle,
  Library: CheckCircle,
  Accounts: CheckCircle,
  Hostel: CheckCircle,
  Proctor: CheckCircle,
  Sports: CheckCircle,
}

const statusIcons = {
  approved: CheckCircle,
  pending: Clock,
  rejected: XCircle,
  "query-raised": AlertCircle,
}

export default function ApprovalTimeline({ timeline, className }) {
  const getStatusIcon = (status) => {
    const Icon = statusIcons[status] || Clock
    return Icon
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600"
      case "rejected":
        return "text-red-600"
      case "query-raised":
        return "text-orange-600"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {timeline.map((item, index) => {
          const Icon = getStatusIcon(item.status)
          const isLast = index === timeline.length - 1
          
          return (
            <motion.div
              key={item.unit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative flex items-start space-x-3"
            >
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-4 top-8 h-8 w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}
              
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                item.status === "pending" 
                  ? "bg-gray-100 dark:bg-gray-800" 
                  : "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700"
              }`}>
                <Icon className={`h-4 w-4 ${getStatusColor(item.status)}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.unit}
                  </p>
                  <StatusBadge status={item.status} />
                </div>
                {item.timestamp && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleDateString()} at{" "}
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
