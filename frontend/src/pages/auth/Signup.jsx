import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Shield, Building2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import logo from "@/images/logo.jpg"

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    role: "",
    unit_type: "",
    hostelName: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const approvingUnits = [
    { value: "department", label: "Department" },
    { value: "hostel", label: "Hostel" },
    { value: "library", label: "Library" },
    { value: "accounts", label: "Accounts" },
    { value: "sports", label: "Sports" },
    { value: "proctor", label: "Proctor" },
  ]

  const hostelList = [
    "Hostel 01",
    "Hostel 02",
    "Hostel 03",
    "Hostel 04",
    "Hostel 05",
    "Hostel 06",
    "Hostel 07",
    "Hostel 08",
    "Hostel 09",
    "Hostel 10A",
    "Hostel 10B",
    "Hostel 10C",
    "Hostel 11",
    "Hostel 12",
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.role) {
      alert("Please select a role")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (formData.role === "student" && !formData.studentId) {
      alert("Please enter your Student ID")
      return
    }

    if (formData.role === "unit" && !formData.unit_type) {
      alert("Please select an Approving Unit")
      return
    }

    if (formData.unit_type === "hostel" && !formData.hostelName) {
      alert("Please select which Hostel")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Registering user with data:", formData)
      navigate("/login")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="NoDuesAutomation Logo" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-center">
              Join NoDuesAutomation by selecting your role
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Role */}
              <div className="space-y-2">
                <Label>Select Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="unit">Approving Unit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Common Fields */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              {/* Student Field */}
              {formData.role === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Approving Unit Fields */}
              {formData.role === "unit" && (
                <>
                  <div className="space-y-2">
                    <Label>Select Approving Unit</Label>
                    <Select
                      value={formData.unit_type}
                      onValueChange={(value) => {
                        handleInputChange("unit_type", value)
                        handleInputChange("hostelName", "") // reset hostel when changing unit
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvingUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Hostel-specific Field */}
                  {formData.unit_type === "hostel" && (
                    <div className="space-y-2">
                      <Label>Select Hostel</Label>
                      <Select
                        value={formData.hostelName}
                        onValueChange={(value) => handleInputChange("hostelName", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hostelList.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
