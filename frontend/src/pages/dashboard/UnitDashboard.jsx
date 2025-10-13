import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Clock, CheckCircle, AlertCircle, FileText, TrendingUp } from "lucide-react"
import useAuthStore from "@/store/useAuthStore"

export default function UnitDashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      title: "Pending Reviews",
      value: "23",
      description: "Awaiting your approval",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Approved Today",
      value: "12",
      description: "Applications approved",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Rejected Today",
      value: "3",
      description: "Applications rejected",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      title: "Total Processed",
      value: "1,456",
      description: "All time processed",
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ]

  const pendingApplications = [
    {
      id: 1,
      student: "John Doe",
      studentId: "2023001",
      submittedAt: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      student: "Jane Smith",
      studentId: "2023002",
      submittedAt: "4 hours ago",
      priority: "medium",
    },
    {
      id: 3,
      student: "Mike Johnson",
      studentId: "2023003",
      submittedAt: "6 hours ago",
      priority: "low",
    },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Unit Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Review and process no-dues applications.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>
                Applications requiring your review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {application.student}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {application.studentId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {application.submittedAt}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(application.priority)}`}>
                      {application.priority}
                    </span>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common unit tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Review Pending Applications
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Approved Applications
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                View Rejected Applications
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
