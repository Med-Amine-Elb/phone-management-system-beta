"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Download, Plus, MoreHorizontal, Edit, Trash2, UserCheck, Filter, Calendar, Smartphone, ArrowRight, Search, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AssignerAssignmentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    user: "",
    phone: "",
    sim: "",
    date: "",
    department: "",
  })
  const [userQuery, setUserQuery] = useState("")
  const [simQuery, setSimQuery] = useState("")
  const [userFocused, setUserFocused] = useState(false)
  const [simFocused, setSimFocused] = useState(false)
  const userInputRef = useRef(null)
  const simInputRef = useRef(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  // Mock user and SIM card lists
  const userList = [
    "John Doe",
    "Sarah Wilson",
    "Mike Johnson",
    "Emily Brown",
    "Marie Martin",
    "Jean Dupont",
    "Sophie Bernard",
    "Lucas Petit",
    "Emma Dubois",
    "Paul Moreau",
  ]
  const simList = [
    "8933011234567890123",
    "8933011234567890124",
    "8933011234567890125",
    "8933011234567890126",
    "8933011234567890127",
    "8933011234567890128",
    "8933011234567890129",
    "8933011234567890130",
    "8933011234567890131",
    "8933011234567890132",
  ]

  const filteredUsers = useMemo(() => userList.filter(u => u.toLowerCase().includes(userQuery.toLowerCase())), [userQuery])
  const filteredSims = useMemo(() => simList.filter(s => s.includes(simQuery)), [simQuery])

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      user: "John Doe",
      userEmail: "john.doe@company.com",
      phone: "iPhone 14 Pro",
      phoneImei: "123456789012345",
      assignedDate: "2024-01-15",
      returnDate: null,
      status: "active",
      department: "IT",
      assignedBy: "Admin User",
      notes: "Primary work device",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      userEmail: "sarah.wilson@company.com",
      phone: "Samsung Galaxy S23",
      phoneImei: "234567890123456",
      assignedDate: "2024-01-10",
      returnDate: "2024-01-20",
      status: "returned",
      department: "HR",
      assignedBy: "Admin User",
      notes: "Temporary assignment",
    },
    {
      id: 3,
      user: "Mike Johnson",
      userEmail: "mike.johnson@company.com",
      phone: "Google Pixel 8",
      phoneImei: "345678901234567",
      assignedDate: "2024-01-12",
      returnDate: null,
      status: "active",
      department: "Sales",
      assignedBy: "HR Manager",
      notes: "Sales team device",
    },
    {
      id: 4,
      user: "Emily Brown",
      userEmail: "emily.brown@company.com",
      phone: "iPhone 15",
      phoneImei: "456789012345678",
      assignedDate: "2024-01-08",
      returnDate: null,
      status: "pending",
      department: "Marketing",
      assignedBy: "Admin User",
      notes: "Awaiting device setup",
    },
  ])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "returned":
        return "bg-slate-100 text-slate-700 border-slate-200"
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-emerald-500 to-emerald-600",
      "from-orange-500 to-orange-600",
      "from-purple-500 to-purple-600",
    ]
    return colors[index % colors.length]
  }

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Export logic
  const handleExport = async () => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const csvContent = [
        [
          "User",
          "Email",
          "Phone",
          "IMEI",
          "Assigned Date",
          "Return Date",
          "Status",
          "Department",
          "Assigned By",
          "Notes",
        ],
        ...filteredAssignments.map((a) => [
          a.user,
          a.userEmail,
          a.phone,
          a.phoneImei,
          a.assignedDate,
          a.returnDate || "",
          a.status,
          a.department,
          a.assignedBy,
          a.notes,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `assignments-export-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Attributions Actives</p>
                <p className="text-3xl font-bold text-slate-800">67</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Retours en Attente</p>
                <p className="text-3xl font-bold text-slate-800">12</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Ce Mois-ci</p>
                <p className="text-3xl font-bold text-slate-800">23</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Retours en Retard</p>
                <p className="text-3xl font-bold text-slate-800">3</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-50 to-red-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800 text-xl">Attributions ({filteredAssignments.length})</CardTitle>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Attribution
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white border-slate-200 shadow-xl rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Nouvelle Attribution</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Utilisateur</label>
                      <Input
                        placeholder="Nom de l'utilisateur"
                        value={userQuery}
                        onChange={e => {
                          setUserQuery(e.target.value)
                          setNewAssignment(a => ({ ...a, user: e.target.value }))
                        }}
                        onFocus={() => setUserFocused(true)}
                        onBlur={() => setTimeout(() => setUserFocused(false), 100)}
                        autoComplete="off"
                        ref={userInputRef}
                      />
                      {userFocused && userQuery && filteredUsers.length > 0 && userQuery !== filteredUsers[0] && (
                        <div className="bg-white border border-slate-200 rounded shadow-md mt-1 max-h-32 overflow-y-auto z-50">
                          {filteredUsers.map(u => (
                            <div
                              key={u}
                              className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                              onMouseDown={() => {
                                setUserQuery(u)
                                setNewAssignment(a => ({ ...a, user: u }))
                                setUserFocused(false)
                              }}
                            >
                              {u}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                      <Input
                        placeholder="Modèle ou IMEI du téléphone"
                        value={newAssignment.phone}
                        onChange={e => setNewAssignment(a => ({ ...a, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">SIM</label>
                      <Input
                        placeholder="Numéro SIM"
                        value={simQuery}
                        onChange={e => {
                          setSimQuery(e.target.value)
                          setNewAssignment(a => ({ ...a, sim: e.target.value }))
                        }}
                        onFocus={() => setSimFocused(true)}
                        onBlur={() => setTimeout(() => setSimFocused(false), 100)}
                        autoComplete="off"
                        ref={simInputRef}
                      />
                      {simFocused && simQuery && filteredSims.length > 0 && simQuery !== filteredSims[0] && (
                        <div className="bg-white border border-slate-200 rounded shadow-md mt-1 max-h-32 overflow-y-auto z-50">
                          {filteredSims.map(s => (
                            <div
                              key={s}
                              className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                              onMouseDown={() => {
                                setSimQuery(s)
                                setNewAssignment(a => ({ ...a, sim: s }))
                                setSimFocused(false)
                              }}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date d'attribution</label>
                      <Input
                        type="date"
                        value={newAssignment.date}
                        onChange={e => setNewAssignment(a => ({ ...a, date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Département</label>
                      <Input
                        placeholder="Département"
                        value={newAssignment.department}
                        onChange={e => setNewAssignment(a => ({ ...a, department: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      onClick={() => {
                        setAssignments(prev => [
                          ...prev,
                          {
                            id: prev.length + 1,
                            user: newAssignment.user,
                            userEmail: "",
                            phone: newAssignment.phone,
                            phoneImei: "",
                            assignedDate: newAssignment.date,
                            returnDate: null,
                            status: "active",
                            department: newAssignment.department,
                            assignedBy: "Assigner",
                            notes: "",
                          },
                        ])
                        setIsAddOpen(false)
                        setNewAssignment({ user: "", phone: "", sim: "", date: "", department: "" })
                        setUserQuery("")
                        setSimQuery("")
                      }}
                      disabled={
                        !newAssignment.user ||
                        !newAssignment.phone ||
                        !newAssignment.sim ||
                        !newAssignment.date ||
                        !newAssignment.department
                      }
                    >
                      Créer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une attribution..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 text-slate-800 w-64 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50/50">
                  <TableHead className="text-slate-700 font-semibold">User</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Phone</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Assigned Date</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Department</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Assigned By</TableHead>
                  <TableHead className="text-slate-700 font-semibold w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment, index) => (
                  <TableRow
                    key={assignment.id}
                    className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeInUp 0.4s ease-out forwards",
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                          <AvatarFallback className={`bg-gradient-to-r ${getAvatarColor(index)} text-white text-sm font-medium`}>
                            {assignment.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-800">{assignment.user}</p>
                          <p className="text-sm text-slate-500">{assignment.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center border border-blue-100">
                          <Smartphone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{assignment.phone}</p>
                          <p className="text-sm text-slate-500 font-mono">{assignment.phoneImei?.slice(-6)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">{assignment.assignedDate}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(assignment.status)} border font-medium capitalize`}>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 font-medium">{assignment.department}</TableCell>
                    <TableCell className="text-slate-700">{assignment.assignedBy}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-slate-200 shadow-lg">
                          <DropdownMenuItem onClick={() => { setSelectedAssignment(assignment); setIsViewOpen(true); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4 py-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 bg-gradient-to-r text-white font-bold text-sm shadow">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    {selectedAssignment.user[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-800">{selectedAssignment.user}</p>
                  <p className="text-xs text-slate-500">{selectedAssignment.userEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium text-slate-800">{selectedAssignment.phone}</p>
                  <p className="text-xs text-slate-500">IMEI: {selectedAssignment.phoneImei}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="font-medium text-slate-800">{selectedAssignment.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Assigned Date</p>
                  <p className="font-medium text-slate-800">{selectedAssignment.assignedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge className={`${getStatusBadgeColor(selectedAssignment.status)} border font-medium capitalize`}>
                    {selectedAssignment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Assigned By</p>
                  <p className="font-medium text-slate-800">{selectedAssignment.assignedBy}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Notes</p>
                  <p className="font-medium text-slate-800">{selectedAssignment.notes}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 