import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { motion } from "framer-motion"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"
import ForgotPassword from "@/pages/auth/ForgotPassword"
import DashboardLayout from "@/layout/DashboardLayout"
import StudentDashboard from "@/pages/dashboard/StudentDashboard"
import AdminDashboard from "@/pages/dashboard/AdminDashboard"
import UnitDashboard from "@/pages/dashboard/UnitDashboard"
import ProtectedRoute from "@/components/ProtectedRoute"

// Student pages
import ApplyPage from "@/pages/student/ApplyPage"
import TrackStatusPage from "@/pages/student/TrackStatusPage"
import QueriesPage from "@/pages/student/QueriesPage"
import HistoryPage from "@/pages/student/HistoryPage"
import ProfilePage from "@/pages/student/ProfilePage"

// Admin pages
import AdminRequestsPage from "@/pages/admin/AdminRequestsPage"
import AdminApprovedPage from "@/pages/admin/AdminApprovedPage"
import AdminCertificatesPage from "@/pages/admin/AdminCertificatesPage"
import AdminManageStudentsPage from "@/pages/admin/AdminManageStudentsPage"
import AdminManageUnitsPage from "@/pages/admin/AdminManageUnitsPage"

// Unit pages
import UnitRequestsPage from "@/pages/unit/UnitRequestsPage"
import UnitQueriesPage from "@/pages/unit/UnitQueriesPage"
import UnitProfilePage from "@/pages/unit/UnitProfilePage"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "student/dashboard",
        element: (
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/apply",
        element: (
          <ProtectedRoute requiredRole="student">
            <ApplyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/track",
        element: (
          <ProtectedRoute requiredRole="student">
            <TrackStatusPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/queries",
        element: (
          <ProtectedRoute requiredRole="student">
            <QueriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/history",
        element: (
          <ProtectedRoute requiredRole="student">
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/profile",
        element: (
          <ProtectedRoute requiredRole="student">
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/requests",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminRequestsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/approved",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminApprovedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/certificates",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminCertificatesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-students",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminManageStudentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-units",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminManageUnitsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "unit/dashboard",
        element: (
          <ProtectedRoute requiredRole="unit">
            <UnitDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "unit/requests",
        element: (
          <ProtectedRoute requiredRole="unit">
            <UnitRequestsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "unit/queries",
        element: (
          <ProtectedRoute requiredRole="unit">
            <UnitQueriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "unit/profile",
        element: (
          <ProtectedRoute requiredRole="unit">
            <UnitProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

export default function AppRouter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <RouterProvider router={router} />
    </motion.div>
  )
}
