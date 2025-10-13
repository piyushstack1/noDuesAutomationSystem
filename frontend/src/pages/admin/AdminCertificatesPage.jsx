import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Eye, Calendar, Filter, Search, Award } from "lucide-react"
import useNoDuesStore from "@/store/useNoDuesStore"

export default function AdminCertificatesPage() {
  const { applications } = useNoDuesStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  const getOverallStatus = (timeline) => {
    const statuses = timeline.map(item => item.status)
    if (statuses.every(status => status === "approved")) return "approved"
    if (statuses.some(status => status === "rejected")) return "rejected"
    if (statuses.some(status => status === "query-raised")) return "query-raised"
    return "pending"
  }

  // Filter only approved applications
  const approvedApplications = applications.filter(app => {
    const overallStatus = getOverallStatus(app.timeline)
    return overallStatus === "approved"
  })

  const filteredApplications = approvedApplications.filter(app => {
    const matchesSearch = 
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    const appDate = new Date(app.submittedAt)
    const now = new Date()
    const matchesDate = 
      dateFilter === "all" ||
      (dateFilter === "week" && (now - appDate) <= 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === "month" && (now - appDate) <= 30 * 24 * 60 * 60 * 1000) ||
      (dateFilter === "year" && (now - appDate) <= 365 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesDate
  })

  const handleDownload = (application) => {
    // Mock download functionality
    console.log("Downloading certificate for application:", application.id)
  }

  const handleView = (application) => {
    // Mock view functionality
    console.log("Viewing certificate for application:", application.id)
  }

  const handleBulkDownload = () => {
    // Mock bulk download functionality
    console.log("Bulk downloading certificates for all filtered applications")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
        <p className="text-muted-foreground">
          Generate and download no-dues certificates for approved applications
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedApplications.length}</div>
              <p className="text-xs text-muted-foreground">
                Certificates available
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
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedApplications.filter(app => {
                  const appDate = new Date(app.submittedAt)
                  const now = new Date()
                  return (now - appDate) <= 30 * 24 * 60 * 60 * 1000
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Generated this month
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
              <CardTitle className="text-sm font-medium">Ready for Download</CardTitle>
              <Download className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredApplications.length}</div>
              <p className="text-xs text-muted-foreground">
                Based on current filters
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                  setDateFilter("all")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleBulkDownload}
                disabled={filteredApplications.length === 0}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Bulk Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Certificates ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Certificates Available</h3>
              <p className="text-muted-foreground">
                {approvedApplications.length === 0 
                  ? "No certificates have been generated yet."
                  : "No certificates match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application, index) => (
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
                        <h3 className="font-semibold">Certificate #{application.id}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Ready</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Student:</span> {application.studentName}
                        </div>
                        <div>
                          <span className="font-medium">ID:</span> {application.studentId}
                        </div>
                        <div>
                          <span className="font-medium">Course:</span> {application.course}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(application.submittedAt).toLocaleDateString()}
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
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(application)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
