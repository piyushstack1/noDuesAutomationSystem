import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Clock, CheckCircle, Filter, Search, Reply } from "lucide-react"
import StatusBadge from "@/components/StatusBadge"
import QueryModal from "@/components/QueryModal"
import useNoDuesStore from "@/store/useNoDuesStore"
import useAuthStore from "@/store/useAuthStore"

export default function UnitQueriesPage() {
  const { user } = useAuthStore()
  const { queries, replyToQuery } = useNoDuesStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState(null)

  // Mock unit type - in real app this would come from user data
  const unitType = "Library" // This would be dynamic based on logged-in unit

  // Filter queries for this unit
  const unitQueries = queries.filter(query => query.unit === unitType)

  const filteredQueries = unitQueries.filter(query => {
    const matchesSearch = 
      query.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.applicationId.toString().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || query.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleReply = async (reply) => {
    if (selectedQuery) {
      replyToQuery(selectedQuery.id, reply)
      setIsReplyModalOpen(false)
      setSelectedQuery(null)
    }
  }

  const openReplyModal = (query) => {
    setSelectedQuery(query)
    setIsReplyModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Queries & Responses</h1>
        <p className="text-muted-foreground">
          Manage queries raised by {unitType} and student responses
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
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unitQueries.length}</div>
              <p className="text-xs text-muted-foreground">
                Queries raised by {unitType}
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
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unitQueries.filter(q => q.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting student response
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
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unitQueries.filter(q => q.status === "resolved").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Queries resolved
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
                  placeholder="Search queries..."
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
                  <SelectItem value="resolved">Resolved</SelectItem>
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

      {/* Queries List */}
      <div className="space-y-4">
        {filteredQueries.map((query, index) => (
          <motion.div
            key={query.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">
                        Query #{query.id}
                      </CardTitle>
                      <CardDescription>
                        Application #{query.applicationId} • {new Date(query.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <StatusBadge status={query.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Query Message:</h4>
                  <p className="text-sm text-muted-foreground">{query.message}</p>
                </div>

                {query.studentReply && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Reply className="h-4 w-4 mr-2" />
                      Student Response:
                    </h4>
                    <p className="text-sm">{query.studentReply}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  {query.status === "pending" && (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Awaiting student response</span>
                    </div>
                  )}
                  {query.status === "resolved" && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Resolved</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredQueries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Queries Found</h3>
              <p className="text-muted-foreground text-center">
                {unitQueries.length === 0 
                  ? "No queries have been raised yet."
                  : "No queries match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Reply Modal */}
      <QueryModal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false)
          setSelectedQuery(null)
        }}
        title={`Reply to Query #${selectedQuery?.id}`}
        description={`Respond to the query: "${selectedQuery?.message}"`}
        submitLabel="Send Reply"
        isReply={true}
        onSubmit={handleReply}
      />
    </div>
  )
}
