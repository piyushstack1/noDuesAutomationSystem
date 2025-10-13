import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, FileText, BarChart3, TrendingUp, Activity } from "lucide-react"
import useAuthStore from "@/store/useAuthStore"

export default function AdminDashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      description: "Registered users",
      icon: Users,
      color: "text-blue-600",
      change: "+12%",
    },
    {
      title: "Applications",
      value: "456",
      description: "This month",
      icon: FileText,
      color: "text-green-600",
      change: "+8%",
    },
    {
      title: "Approved",
      value: "89%",
      description: "Success rate",
      icon: TrendingUp,
      color: "text-emerald-600",
      change: "+2%",
    },
    {
      title: "Active Units",
      value: "12",
      description: "Processing units",
      icon: Activity,
      color: "text-purple-600",
      change: "0%",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "submitted application",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "application approved",
      time: "15 minutes ago",
      status: "approved",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "application rejected",
      time: "1 hour ago",
      status: "rejected",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "submitted application",
      time: "2 hours ago",
      status: "pending",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's what's happening with your system.
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
                <div className="flex items-center pt-1">
                  <span className="text-xs text-green-600 font-medium">
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    from last month
                  </span>
                </div>
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
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest system activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      activity.status === 'approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : activity.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
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
                Administrative tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View All Applications
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
