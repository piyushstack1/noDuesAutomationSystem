import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200",
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200",
  },
}

export default function Toast({ 
  id, 
  title, 
  description, 
  type = "info", 
  duration = 5000, 
  onClose 
}) {
  const config = toastVariants[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg",
        config.className
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">{title}</p>
            )}
            {description && (
              <p className="mt-1 text-sm opacity-90">{description}</p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className="inline-flex rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => onClose?.(id)}
            >
              <span className="sr-only">Close</span>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
