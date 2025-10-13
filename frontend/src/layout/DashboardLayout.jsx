import { Outlet, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import useAuthStore from "@/store/useAuthStore"

export default function DashboardLayout() {
  const { user, isAuthenticated } = useAuthStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <main className="flex-1">
          {/* Mobile menu button */}
          <div className="md:hidden p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
