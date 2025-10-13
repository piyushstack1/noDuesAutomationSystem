import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Clock, CheckCircle } from "lucide-react"
import useNoDuesStore from "@/store/useNoDuesStore"
import useNotificationStore from "@/store/useNotificationStore"
import Loader from "@/components/Loader"

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    studentId: "",
    course: "",
    year: "",
    reason: "",
    documents: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const submitApplication = useNoDuesStore((state) => state.submitApplication)
  const addNotification = useNotificationStore((state) => state.addNotification)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const application = submitApplication({
        studentId: formData.studentId,
        course: formData.course,
        year: formData.year,
        reason: formData.reason,
        documents: formData.documents,
      })

      addNotification({
        title: "Application Submitted",
        message: "Your no-dues application has been submitted successfully",
        type: "success",
      })

      navigate("/student/dashboard")
    } catch (error) {
      addNotification({
        title: "Submission Failed",
        message: "Failed to submit application. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apply for No Dues</h1>
        <p className="text-muted-foreground">
          Submit your no-dues clearance application
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Form
            </CardTitle>
            <CardDescription>
              Fill in the details below to submit your no-dues application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={formData.course}
                    onValueChange={(value) => handleInputChange("course", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => handleInputChange("year", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for No Dues</Label>
                <textarea
                  id="reason"
                  placeholder="Briefly describe why you need no-dues clearance..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Required Documents</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {[
                    "ID Card Copy",
                    "Fee Receipt",
                    "Library Clearance",
                    "Hostel Clearance",
                    "Lab Clearance",
                    "Sports Clearance"
                  ].map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/student/dashboard")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
