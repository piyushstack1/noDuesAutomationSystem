import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react"
import ApprovalTimeline from "@/components/ApprovalTimeline"
import StatusBadge from "@/components/StatusBadge"
import QueryModal from "@/components/QueryModal"
import useNoDuesStore from "@/store/useNoDuesStore"
import useAuthStore from "@/store/useAuthStore"

export default function TrackStatusPage() {
  const { user } = useAuthStore()
  const { applications } = useNoDuesStore()
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false)

  // Get applications for current user
  const userApplications = applications.filter(app => 
    app.studentId === user?.email.split("@")[0] || 
    app.studentName === user?.name
  )

  const getOverallStatus = (timeline) => {
    const statuses = timeline.map(item => item.status)
    if (statuses.every(status => status === "approved")) return "approved"
    if (statuses.some(status => status === "rejected")) return "rejected"
    if (statuses.some(status => status === "query-raised")) return "query-raised"
    return "pending"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      case "query-raised":
        return AlertCircle
      default:
        return Clock
    }
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Track Application Status</h1>
        <p className="text-muted-foreground">
          Monitor the progress of your no-dues applications
        </p>
      </div>

      {userApplications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't submitted any no-dues applications yet.
              </p>
              <Button onClick={() => window.location.href = "/student/apply"}>
                Submit New Application
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {userApplications.map((application, index) => {
            const overallStatus = getOverallStatus(application.timeline)
            const StatusIcon = getStatusIcon(overallStatus)
            
            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedApplication(application)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-5 w-5 ${getStatusColor(overallStatus)}`} />
                        <div>
                          <CardTitle className="text-lg">
                            Application #{application.id}
                          </CardTitle>
                          <CardDescription>
                            Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <StatusBadge status={overallStatus} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Student ID:</span> {application.studentId}
                        </div>
                        <div>
                          <span className="font-medium">Course:</span> {application.course}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Click to view detailed timeline
                        </span>
                        {overallStatus === "query-raised" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsQueryModalOpen(true)
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Queries
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Detailed Timeline Modal */}
      {selectedApplication && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedApplication(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Application #{selectedApplication.id} Timeline
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </Button>
            </div>
            
            <ApprovalTimeline timeline={selectedApplication.timeline} />
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedApplication(null)}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Query Modal */}
      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        title="Application Queries"
        description="View and respond to queries raised by approving units"
        submitLabel="Reply to Query"
        isReply={true}
      />
    </div>
  )
}
