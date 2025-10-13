import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, CheckCircle, XCircle, Clock, Filter, Search } from "lucide-react"
import StatusBadge from "@/components/StatusBadge"
import ApprovalTimeline from "@/components/ApprovalTimeline"
import useNoDuesStore from "@/store/useNoDuesStore"
import useNotificationStore from "@/store/useNotificationStore"

export default function AdminRequestsPage() {
  const { applications, updateApplicationStatus } = useNoDuesStore()
  const { addNotification } = useNotificationStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState(null)

  const getOverallStatus = (timeline) => {
    const statuses = timeline.map(item => item.status)
    if (statuses.every(status => status === "approved")) return "approved"
    if (statuses.some(status => status === "rejected")) return "rejected"
    if (statuses.some(status => status === "query-raised")) return "query-raised"
    return "pending"
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    const overallStatus = getOverallStatus(app.timeline)
    const matchesStatus = statusFilter === "all" || overallStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleApprove = (applicationId) => {
    // Approve all units for this application
    const units = ["Department", "Library", "Accounts", "Hostel", "Proctor", "Sports"]
    units.forEach(unit => {
      updateApplicationStatus(applicationId, unit, "approved")
    })
    
    addNotification({
      title: "Application Approved",
      message: `Application #${applicationId} has been approved`,
      type: "success",
    })
  }

  const handleReject = (applicationId) => {
    // Reject the application
    updateApplicationStatus(applicationId, "Department", "rejected")
    
    addNotification({
      title: "Application Rejected",
      message: `Application #${applicationId} has been rejected`,
      type: "error",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Requests</h1>
        <p className="text-muted-foreground">
          Review and manage pending no-dues applications
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="query-raised">Query Raised</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application, index) => {
          const overallStatus = getOverallStatus(application.timeline)
          
          return (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">
                          Application #{application.id}
                        </CardTitle>
                        <CardDescription>
                          Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={overallStatus} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="font-medium">Student:</span> {application.studentName}
                    </div>
                    <div>
                      <span className="font-medium">ID:</span> {application.studentId}
                    </div>
                    <div>
                      <span className="font-medium">Course:</span> {application.course}
                    </div>
                    <div>
                      <span className="font-medium">Year:</span> {application.year}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(application.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(application.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Detailed View Modal */}
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
            className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Application #{selectedApplication.id} Details
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Student Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedApplication.studentName}</div>
                  <div><span className="font-medium">ID:</span> {selectedApplication.studentId}</div>
                  <div><span className="font-medium">Course:</span> {selectedApplication.course}</div>
                  <div><span className="font-medium">Year:</span> {selectedApplication.year}</div>
                  <div><span className="font-medium">Submitted:</span> {new Date(selectedApplication.submittedAt).toLocaleString()}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Approval Timeline</h3>
                <ApprovalTimeline timeline={selectedApplication.timeline} />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleReject(selectedApplication.id)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(selectedApplication.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
