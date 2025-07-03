"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  Filter,
  Download,
  Calendar,
  Smartphone,
  ArrowRight,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function AssignmentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
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

  const assignments = [
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
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Gestion des Attributions</h1>
          <p className="text-slate-600 dark:text-slate-400">Suivez et gérez les attributions de téléphones dans votre organisation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg text-white dark:from-blue-700 dark:to-cyan-800">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Attribution
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
              <DialogHeader>
                <DialogTitle>Nouvelle Attribution</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Utilisateur</label>
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
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-md mt-1 max-h-32 overflow-y-auto z-50">
                      {filteredUsers.map(u => (
                        <div
                          key={u}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 text-slate-800 dark:text-slate-100"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            setUserQuery(u)
                            setNewAssignment(a => ({ ...a, user: u }))
                            setUserFocused(false)
                            if (userInputRef.current) userInputRef.current.blur()
                          }}
                        >
                          {u}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Téléphone</label>
                  <Input
                    placeholder="Modèle ou IMEI"
                    value={newAssignment.phone}
                    onChange={e => setNewAssignment(a => ({ ...a, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Numéro de carte SIM</label>
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
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-md mt-1 max-h-32 overflow-y-auto z-50">
                      {filteredSims.map(s => (
                        <div
                          key={s}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 text-slate-800 dark:text-slate-100"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            setSimQuery(s)
                            setNewAssignment(a => ({ ...a, sim: s }))
                            setSimFocused(false)
                            if (simInputRef.current) simInputRef.current.blur()
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Date d'attribution</label>
                  <Input type="date" value={newAssignment.date} onChange={e => setNewAssignment(a => ({ ...a, date: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Département</label>
                  <Input placeholder="Département" value={newAssignment.department} onChange={e => setNewAssignment(a => ({ ...a, department: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Annuler
                </Button>
                <Button>
                  Ajouter l'Attribution
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Attributions Actives</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">67</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Retours en Attente</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">12</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Ce Mois-ci</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">23</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Retours en Retard</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">3</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800 dark:text-slate-100 text-xl">Attributions ({filteredAssignments.length})</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <Input
                  placeholder="Rechercher une attribution..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 w-64 focus:border-blue-400 dark:focus:border-blue-600 focus:ring-blue-400/20 dark:focus:ring-blue-600/20"
                />
              </div>
              <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <TableHead className="text-slate-700 dark:text-slate-200 font-semibold">User</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-200 font-semibold">Phone</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-200 font-semibold">Assigned Date</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-200 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-200 font-semibold">Department</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-200 font-semibold">Assigned By</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-200 font-semibold w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment, index) => (
                  <TableRow
                    key={assignment.id}
                    className="border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeInUp 0.4s ease-out forwards",
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 border-2 border-white dark:border-slate-800 shadow-md">
                          <AvatarFallback
                            className={`bg-gradient-to-r ${getAvatarColor(index)} text-white text-sm font-medium`}
                          >
                            {assignment.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{assignment.user}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-lg flex items-center justify-center border border-blue-100 dark:border-blue-900">
                          <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{assignment.phone}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{assignment.phoneImei.slice(-6)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-200">{assignment.assignedDate}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(assignment.status)} border font-medium capitalize`}>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-200 font-medium">{assignment.department}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-200">{assignment.assignedBy}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-lg">
                          <DropdownMenuItem className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier l'attribution
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Marquer comme retourné
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer l'attribution
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
    </div>
  )
}
