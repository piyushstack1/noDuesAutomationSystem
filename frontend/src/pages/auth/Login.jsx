import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import logo from "@/images/logo.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAuthStore from "@/store/useAuthStore"
import { GraduationCap, Shield, Building2 } from "lucide-react"

const roleIcons = {
  student: GraduationCap,
  admin: Shield,
  unit: Building2,
}

const roleLabels = {
  student: "Student",
  admin: "Admin",
  unit: "Approving Unit",
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    unit_type: ""
  })
  const [showUnitSelect, setShowUnitSelect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const approvingUnits = [
    { value: "department", label: "Department" },
    { value: "hostel", label: "Hostel" },
    { value: "library", label: "Library" },
    { value: "accounts", label: "Accounts" },
    { value: "sports", label: "Sports" },
    { value: "proctor", label: "Proctor" }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.role === "unit" && !formData.unit_type) {
      alert("Please select an approving unit")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const userData = {
        role: formData.role,
        name: formData.email.split("@")[0],
        email: formData.email,
        unit_type: formData.unit_type
      }
      
      login(userData)
      navigate(`/${formData.role}/dashboard`)
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your NoDuesAutomation account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([key, label]) => {
                      const Icon = roleIcons[key]
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "unit" && (
                <div className="space-y-2">
                  <Label htmlFor="unit_type">Select Approving Unit</Label>
                  <Select
                    value={formData.unit_type}
                    onValueChange={(value) => handleInputChange("unit_type", value)}
                    required
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
              )}

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-center text-sm">
              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot your password?
              </Link>
              <div>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
