import { Navigate } from "react-router-dom"
import useAuthStore from "@/store/useAuthStore"

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />
  }

  return children
}
