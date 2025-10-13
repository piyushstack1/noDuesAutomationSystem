import { motion } from "framer-motion"

export default function Loader({ size = "md", className }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

export function ShimmerLoader({ className }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

export function TableLoader({ rows = 5, className }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
