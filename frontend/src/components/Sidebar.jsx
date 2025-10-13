import { motion } from "framer-motion"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import useAuthStore from "@/store/useAuthStore"
import {
  GraduationCap,
  Shield,
  Building2,
  Home,
  FileText,
  Settings,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  CreditCard,
  Building,
  ShieldCheck,
  Trophy,
  MessageSquare,
} from "lucide-react"

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/student/dashboard", icon: Home },
    { name: "Apply for No Dues", href: "/student/apply", icon: FileText },
    { name: "Track Status", href: "/student/track", icon: Clock },
    { name: "Queries", href: "/student/queries", icon: MessageSquare },
    { name: "History", href: "/student/history", icon: FileText },
    { name: "Profile", href: "/student/profile", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Pending Requests", href: "/admin/requests", icon: Clock },
    { name: "Approved Applications", href: "/admin/approved", icon: CheckCircle },
    { name: "Certificates", href: "/admin/certificates", icon: FileText },
    { name: "Manage Students", href: "/admin/manage-students", icon: Users },
    { name: "Manage Units", href: "/admin/manage-units", icon: Building2 },
  ],
  unit: [
    { name: "Dashboard", href: "/unit/dashboard", icon: Home },
    { name: "Pending Requests", href: "/unit/requests", icon: Clock },
    { name: "Queries", href: "/unit/queries", icon: MessageSquare },
    { name: "Profile", href: "/unit/profile", icon: Settings },
  ],
}

const unitSpecificItems = {
  department: [
    { name: "Department Clearance", href: "/unit/department", icon: Building },
  ],
  library: [
    { name: "Library Clearance", href: "/unit/library", icon: BookOpen },
  ],
  accounts: [
    { name: "Accounts Clearance", href: "/unit/accounts", icon: CreditCard },
  ],
  hostel: [
    { name: "Hostel Clearance", href: "/unit/hostel", icon: Building },
  ],
  proctor: [
    { name: "Proctor Clearance", href: "/unit/proctor", icon: ShieldCheck },
  ],
  sports: [
    { name: "Sports Clearance", href: "/unit/sports", icon: Trophy },
  ],
}

const roleIcons = {
  student: GraduationCap,
  admin: Shield,
  unit: Building2,
}

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user } = useAuthStore()
  const role = user?.role

  if (!role) return null

  const roleIcon = roleIcons[role]
  const items = navigationItems[role] || []

  // Add unit-specific items if user is a unit
  const unitType = user?.unitType // This would come from user data
  const unitItems = unitSpecificItems[unitType] || []

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed md:relative z-50 md:z-auto
          w-64 h-full bg-card border-r
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            {roleIcon && <roleIcon className="h-8 w-8 text-primary mr-2" />}
            <h2 className="text-lg font-semibold text-foreground">
              {role === "student" && "Student Portal"}
              {role === "admin" && "Admin Panel"}
              {role === "unit" && "Unit Portal"}
            </h2>
          </div>

          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      "text-muted-foreground group-hover:text-accent-foreground"
                    )}
                  />
                  {item.name}
                </NavLink>
              ))}

              {/* Unit-specific items */}
              {unitItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      "text-muted-foreground group-hover:text-accent-foreground"
                    )}
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>

    </>
  )
}
