import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Clock, CheckCircle, Upload, X } from "lucide-react"
import useNoDuesStore from "@/store/useNoDuesStore"
import useNotificationStore from "@/store/useNotificationStore"
import Loader from "@/components/Loader"

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    studentName: "",
    scholarNo: "",
    department: "",
    branch: "",
    degree: "",
    course: "",
    mobileNo: "",
    email: "",
    hostelNo: "",
    roomNo: "",
    cgpa: "",
    aadharPassport: "",
    address: "",
    bankAccountNo: "",
    ifscCode: "",
    profilePicture: null,
    isHosteler: true,
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

    // Show loading toast
    const loadingToast = toast.loading("Submitting your application...")

    try {
      // Validate required fields
      if (!formData.studentName || !formData.scholarNo || !formData.email || !formData.course) {
        toast.error("Please fill all required fields", { id: loadingToast })
        setIsLoading(false)
        return
      }

      if (!formData.profilePicture) {
        toast.error("Please upload your profile picture", { id: loadingToast })
        setIsLoading(false)
        return
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData()
      
      // Add student_id (using scholarNo as student_id)
      submitData.append('student_id', formData.scholarNo)
      submitData.append('studentName', formData.studentName)
      submitData.append('scholarNo', formData.scholarNo)
      submitData.append('department', formData.department)
      submitData.append('branch', formData.branch)
      submitData.append('degree', formData.degree)
      submitData.append('course', formData.course)
      submitData.append('mobileNo', formData.mobileNo)
      submitData.append('email', formData.email)
      submitData.append('hostelNo', formData.hostelNo)
      submitData.append('roomNo', formData.roomNo)
      submitData.append('cgpa', formData.cgpa)
      submitData.append('aadharPassport', formData.aadharPassport)
      submitData.append('address', formData.address)
      submitData.append('bankAccountNo', formData.bankAccountNo)
      submitData.append('ifscCode', formData.ifscCode)
      submitData.append('isHosteler', formData.isHosteler)
      submitData.append('reason', formData.reason)
      
      // Add profile picture
      if (formData.profilePicture) {
        submitData.append('profilePicture', formData.profilePicture)
      }
      
      // Add documents
      formData.documents.forEach((doc) => {
        submitData.append('documents', doc)
      })

      // Make API call
      const response = await fetch('http://localhost:5000/api/student/noduesform', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error types
        const errorMessage = data.error || data.message || 'Failed to submit application'
        
        if (errorMessage.includes('Department')) {
          toast.error(`❌ ${errorMessage}\n\nPlease select a valid department from the dropdown.`, { 
            id: loadingToast,
            duration: 5000 
          })
        } else if (errorMessage.includes('Hostel')) {
          toast.error(`❌ ${errorMessage}\n\nPlease enter a valid hostel number (H1, H2, or H3).`, { 
            id: loadingToast,
            duration: 5000 
          })
        } else if (errorMessage.includes('already exists')) {
          toast.error(`❌ ${errorMessage}\n\nYou already have an active request.`, { 
            id: loadingToast,
            duration: 5000 
          })
        } else {
          toast.error(`❌ ${errorMessage}`, { 
            id: loadingToast,
            duration: 4000 
          })
        }
        
        throw new Error(errorMessage)
      }

      // Success
      toast.success("Application submitted successfully! 🎉", { id: loadingToast })
      
      addNotification({
        title: "Application Submitted",
        message: "Your no-dues application has been submitted successfully",
        type: "success",
      })

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/student/dashboard")
      }, 1500)

    } catch (error) {
      console.error("Submission error:", error)
      
      // Only show error notification if toast hasn't already been updated
      if (!error.message?.includes('Department') && 
          !error.message?.includes('Hostel') && 
          !error.message?.includes('already exists')) {
        toast.error(error.message || "Failed to submit application. Please try again.", { 
          id: loadingToast,
          duration: 4000 
        })
      }
      
      addNotification({
        title: "Submission Failed",
        message: error.message || "Failed to submit application. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }))
    }
  }

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files]
      }))
    }
  }

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
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
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      placeholder="Enter your full name"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scholarNo">Scholar No. *</Label>
                    <Input
                      id="scholarNo"
                      placeholder="Enter your scholar number"
                      value={formData.scholarNo}
                      onChange={(e) => handleInputChange("scholarNo", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email ID *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNo">Mobile No. *</Label>
                    <Input
                      id="mobileNo"
                      placeholder="Enter your mobile number"
                      value={formData.mobileNo}
                      onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharPassport">Aadhar No./Passport No. *</Label>
                    <Input
                      id="aadharPassport"
                      placeholder="Enter Aadhar or Passport number"
                      value={formData.aadharPassport}
                      onChange={(e) => handleInputChange("aadharPassport", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture *</Label>
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <textarea
                    id="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  />
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Academic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange("department", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                        <SelectItem value="ECE">Electronics & Communication</SelectItem>
                        <SelectItem value="ME">Mechanical Engineering</SelectItem>
                        <SelectItem value="CE">Civil Engineering</SelectItem>
                        <SelectItem value="EE">Electrical Engineering</SelectItem>
                        <SelectItem value="IT">Information Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <Input
                      id="branch"
                      placeholder="Enter your branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree *</Label>
                    <Select
                      value={formData.degree}
                      onValueChange={(value) => handleInputChange("degree", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="mtech">M.Tech</SelectItem>
                        <SelectItem value="phd">Ph.D</SelectItem>
                        <SelectItem value="msc">M.Sc</SelectItem>
                        <SelectItem value="bsc">B.Sc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Input
                      id="course"
                      placeholder="Enter your course"
                      value={formData.course}
                      onChange={(e) => handleInputChange("course", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA *</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="Enter your CGPA"
                      value={formData.cgpa}
                      onChange={(e) => handleInputChange("cgpa", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Hostel Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Hostel Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isHosteler"
                      checked={formData.isHosteler}
                      onChange={(e) => handleInputChange("isHosteler", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isHosteler" className="cursor-pointer">
                      I am a Hosteler (uncheck if Day Scholar)
                    </Label>
                  </div>

                  {formData.isHosteler && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="hostelNo">Hostel No. *</Label>
                        <Input
                          id="hostelNo"
                          placeholder="Enter hostel number"
                          value={formData.hostelNo}
                          onChange={(e) => handleInputChange("hostelNo", e.target.value)}
                          required={formData.isHosteler}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roomNo">Room No. *</Label>
                        <Input
                          id="roomNo"
                          placeholder="Enter room number"
                          value={formData.roomNo}
                          onChange={(e) => handleInputChange("roomNo", e.target.value)}
                          required={formData.isHosteler}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Bank Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountNo">State Bank Account No. *</Label>
                    <Input
                      id="bankAccountNo"
                      placeholder="Enter your account number"
                      value={formData.bankAccountNo}
                      onChange={(e) => handleInputChange("bankAccountNo", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      placeholder="Enter IFSC code"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>


              {/* Documents Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Upload Documents</h3>
                <div className="space-y-2">
                  <Label htmlFor="documents">Upload Required Documents</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleDocumentsChange}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('documents')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
                  </p>
                </div>

                {/* Uploaded Documents List */}
                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Documents ({formData.documents.length})</Label>
                    <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                      {formData.documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-4 w-4 flex-shrink-0 text-blue-600" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              ({(file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
