import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Reply, Clock, CheckCircle } from "lucide-react"
import StatusBadge from "@/components/StatusBadge"
import QueryModal from "@/components/QueryModal"
import useNoDuesStore from "@/store/useNoDuesStore"
import useAuthStore from "@/store/useAuthStore"

export default function QueriesPage() {
  const { user } = useAuthStore()
  const { queries, replyToQuery } = useNoDuesStore()
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Get queries for current user
  const userQueries = queries.filter(query => 
    query.applicationId === 1 // This would be dynamic based on user's applications
  )

  const filteredQueries = userQueries.filter(query =>
    query.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.unit.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          View and respond to queries raised by approving units
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status="pending" />
          <span className="text-sm text-muted-foreground">
            {userQueries.filter(q => q.status === "pending").length} Pending
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status="resolved" />
          <span className="text-sm text-muted-foreground">
            {userQueries.filter(q => q.status === "resolved").length} Resolved
          </span>
        </div>
      </div>

      {filteredQueries.length === 0 ? (
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
                {searchTerm 
                  ? "No queries match your search criteria."
                  : "No queries have been raised for your applications yet."
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
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
                          Query from {query.unit}
                        </CardTitle>
                        <CardDescription>
                          {new Date(query.createdAt).toLocaleDateString()} at{" "}
                          {new Date(query.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
                        Your Reply:
                      </h4>
                      <p className="text-sm">{query.studentReply}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    {query.status === "pending" && (
                      <Button
                        variant="outline"
                        onClick={() => openReplyModal(query)}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply to Query
                      </Button>
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
      )}

      {/* Reply Modal */}
      <QueryModal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false)
          setSelectedQuery(null)
        }}
        title={`Reply to ${selectedQuery?.unit} Query`}
        description={`Respond to the query: "${selectedQuery?.message}"`}
        submitLabel="Send Reply"
        isReply={true}
        onSubmit={handleReply}
      />
    </div>
  )
}
