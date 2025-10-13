import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, CheckCircle, XCircle, MessageSquare, Clock, Filter, Search } from "lucide-react"
import StatusBadge from "@/components/StatusBadge"
import QueryModal from "@/components/QueryModal"
import useNoDuesStore from "@/store/useNoDuesStore"
import useAuthStore from "@/store/useAuthStore"

export default function UnitRequestsPage() {
  const { user } = useAuthStore()
  const { applications, updateApplicationStatus, addQuery } = useNoDuesStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  // Mock unit type - in real app this would come from user data
  const unitType = "Library" // This would be dynamic based on logged-in unit

  const getOverallStatus = (timeline) => {
    const statuses = timeline.map(item => item.status)
    if (statuses.every(status => status === "approved")) return "approved"
    if (statuses.some(status => status === "rejected")) return "rejected"
    if (statuses.some(status => status === "query-raised")) return "query-raised"
    return "pending"
  }

  // Filter applications that are pending for this unit
  const unitApplications = applications.filter(app => {
    const unitTimeline = app.timeline.find(item => item.unit === unitType)
    return unitTimeline && unitTimeline.status === "pending"
  })

  const filteredApplications = unitApplications.filter(app => {
    const matchesSearch = 
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    const overallStatus = getOverallStatus(app.timeline)
    const matchesStatus = statusFilter === "all" || overallStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleApprove = (applicationId) => {
    updateApplicationStatus(applicationId, unitType, "approved")
  }

  const handleReject = (applicationId) => {
    updateApplicationStatus(applicationId, unitType, "rejected")
  }

  const handleRaiseQuery = async (message) => {
    if (selectedApplication) {
      addQuery({
        applicationId: selectedApplication.id,
        unit: unitType,
        message: message,
      })
      updateApplicationStatus(selectedApplication.id, unitType, "query-raised")
      setIsQueryModalOpen(false)
      setSelectedApplication(null)
    }
  }

  const openQueryModal = (application) => {
    setSelectedApplication(application)
    setIsQueryModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Requests</h1>
        <p className="text-muted-foreground">
          Review and process no-dues applications for {unitType}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unitApplications.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your approval
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Applications approved
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Applications rejected
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queries Raised</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Queries raised today
              </p>
            </CardContent>
          </Card>
        </motion.div>
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
                      onClick={() => openQueryModal(application)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Raise Query
                    </Button>
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
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredApplications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground text-center">
                There are no applications pending your review at the moment.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Query Modal */}
      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => {
          setIsQueryModalOpen(false)
          setSelectedApplication(null)
        }}
        title={`Raise Query for Application #${selectedApplication?.id}`}
        description={`Enter your query message for ${selectedApplication?.studentName}`}
        submitLabel="Raise Query"
        onSubmit={handleRaiseQuery}
      />
    </div>
  )
}
