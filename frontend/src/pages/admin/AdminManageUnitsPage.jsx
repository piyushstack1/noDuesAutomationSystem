import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Plus, Edit, Trash2, Search, Filter, Settings } from "lucide-react"
import StatusBadge from "@/components/StatusBadge"
import QueryModal from "@/components/QueryModal"
import useNoDuesStore from "@/store/useNoDuesStore"

export default function AdminManageUnitsPage() {
  const { units, addUnit, updateUnit, deleteUnit } = useNoDuesStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "active",
  })

  const filteredUnits = units.filter(unit => {
    const matchesSearch = 
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || unit.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddUnit = async (data) => {
    addUnit(data)
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEditUnit = async (data) => {
    updateUnit(selectedUnit.id, data)
    setIsEditModalOpen(false)
    setSelectedUnit(null)
    resetForm()
  }

  const handleDeleteUnit = (unitId) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      deleteUnit(unitId)
    }
  }

  const openEditModal = (unit) => {
    setSelectedUnit(unit)
    setFormData({
      name: unit.name,
      type: unit.type,
      status: unit.status,
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      status: "active",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Units</h1>
        <p className="text-muted-foreground">
          Add, edit, and manage approving units
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{units.length}</div>
              <p className="text-xs text-muted-foreground">
                Approving units
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
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Settings className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {units.filter(u => u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active units
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
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <Settings className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {units.filter(u => u.status === "inactive").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Inactive units
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Types</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(units.map(u => u.type)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Different types
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search units..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
            
            <div className="flex items-end">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Units ({filteredUnits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUnits.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Units Found</h3>
              <p className="text-muted-foreground">
                {units.length === 0 
                  ? "No units have been configured yet."
                  : "No units match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUnits.map((unit, index) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{unit.name}</h3>
                        <StatusBadge status={unit.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Type:</span> {unit.type}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {unit.status}
                        </div>
                        <div>
                          <span className="font-medium">ID:</span> {unit.id}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(unit)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Unit Modal */}
      <QueryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          resetForm()
        }}
        title="Add New Unit"
        description="Enter the unit details below"
        submitLabel="Add Unit"
        onSubmit={handleAddUnit}
      />

      {/* Edit Unit Modal */}
      <QueryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUnit(null)
          resetForm()
        }}
        title="Edit Unit"
        description="Update the unit details"
        submitLabel="Update Unit"
        onSubmit={handleEditUnit}
      />
    </div>
  )
}
