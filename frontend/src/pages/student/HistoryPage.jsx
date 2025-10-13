import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Eye, Calendar, Filter } from "lucide-react"
import StatusBadge from "@/components/StatusBadge"
import useNoDuesStore from "@/store/useNoDuesStore"
import useAuthStore from "@/store/useAuthStore"

export default function HistoryPage() {
  const { user } = useAuthStore()
  const { applications } = useNoDuesStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

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

  const filteredApplications = userApplications.filter(app => {
    const matchesSearch = 
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    const overallStatus = getOverallStatus(app.timeline)
    const matchesStatus = statusFilter === "all" || overallStatus === statusFilter
    
    const appDate = new Date(app.submittedAt)
    const now = new Date()
    const matchesDate = 
      dateFilter === "all" ||
      (dateFilter === "week" && (now - appDate) <= 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === "month" && (now - appDate) <= 30 * 24 * 60 * 60 * 1000) ||
      (dateFilter === "year" && (now - appDate) <= 365 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleDownload = (application) => {
    // Mock download functionality
    console.log("Downloading application:", application.id)
  }

  const handleView = (application) => {
    // Mock view functionality
    console.log("Viewing application:", application.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Application History</h1>
        <p className="text-muted-foreground">
          View all your submitted no-dues applications
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                {userApplications.length === 0 
                  ? "You haven't submitted any applications yet."
                  : "No applications match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application, index) => {
                const overallStatus = getOverallStatus(application.timeline)
                
                return (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">Application #{application.id}</h3>
                          <StatusBadge status={overallStatus} />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Student ID:</span> {application.studentId}
                          </div>
                          <div>
                            <span className="font-medium">Course:</span> {application.course}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Year:</span> {application.year}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(application)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {overallStatus === "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(application)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
