"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Loader2,
  CreditCard,
  Smartphone,
  Signal,
  Shield,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip } from "recharts"

interface SimCard {
  id: number
  simNumber: string
  ssid: string
  pinCode: string
  pukCode: string
  forfait: string
  operator: string
  status: "assigned" | "available"
  assignedTo?: string
  assignedPhone?: string
  createdDate: string
}

export default function SimCardManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOperator, setFilterOperator] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterForfait, setFilterForfait] = useState("all")
  const [isAddSimOpen, setIsAddSimOpen] = useState(false)
  const [isEditSimOpen, setIsEditSimOpen] = useState(false)
  const [selectedSim, setSelectedSim] = useState<SimCard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showPinPuk, setShowPinPuk] = useState<{ [key: number]: boolean }>({})
  const { toast } = useToast()

  const [simCards, setSimCards] = useState<SimCard[]>([
    {
      id: 1,
      simNumber: "8933011234567890123",
      ssid: "SIM001",
      pinCode: "1234",
      pukCode: "12345678",
      forfait: "Forfait Pro 50GB",
      operator: "Orange",
      status: "assigned",
      assignedTo: "Jean Dupont",
      assignedPhone: "iPhone 14 Pro",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      simNumber: "8933011234567890124",
      ssid: "SIM002",
      pinCode: "5678",
      pukCode: "87654321",
      forfait: "Forfait Business 100GB",
      operator: "SFR",
      status: "assigned",
      assignedTo: "Marie Martin",
      assignedPhone: "Samsung Galaxy S23",
      createdDate: "2024-01-20",
    },
    {
      id: 3,
      simNumber: "8933011234567890125",
      ssid: "SIM003",
      pinCode: "9012",
      pukCode: "11223344",
      forfait: "Forfait Standard 20GB",
      operator: "Bouygues",
      status: "available",
      createdDate: "2024-02-01",
    },
    {
      id: 4,
      simNumber: "8933011234567890126",
      ssid: "SIM004",
      pinCode: "3456",
      pukCode: "44332211",
      forfait: "Forfait Illimité",
      operator: "Free",
      status: "available",
      createdDate: "2024-02-05",
    },
    // Additional diverse data for better chart visualization
    {
      id: 5,
      simNumber: "8933011234567890127",
      ssid: "SIM005",
      pinCode: "2222",
      pukCode: "22222222",
      forfait: "Forfait Pro 50GB",
      operator: "Orange",
      status: "assigned",
      assignedTo: "Alice Leroy",
      assignedPhone: "iPhone 13",
      createdDate: "2024-03-10",
    },
    {
      id: 6,
      simNumber: "8933011234567890128",
      ssid: "SIM006",
      pinCode: "3333",
      pukCode: "33333333",
      forfait: "Forfait Business 100GB",
      operator: "SFR",
      status: "available",
      createdDate: "2024-03-12",
    },
    {
      id: 7,
      simNumber: "8933011234567890129",
      ssid: "SIM007",
      pinCode: "4444",
      pukCode: "44444444",
      forfait: "Forfait Standard 20GB",
      operator: "Bouygues",
      status: "assigned",
      assignedTo: "Sophie Bernard",
      assignedPhone: "Google Pixel 7",
      createdDate: "2024-04-01",
    },
    {
      id: 8,
      simNumber: "8933011234567890130",
      ssid: "SIM008",
      pinCode: "5555",
      pukCode: "55555555",
      forfait: "Forfait Illimité",
      operator: "Free",
      status: "assigned",
      assignedTo: "Lucas Petit",
      assignedPhone: "Samsung Galaxy S22",
      createdDate: "2024-04-10",
    },
    {
      id: 9,
      simNumber: "8933011234567890131",
      ssid: "SIM009",
      pinCode: "6666",
      pukCode: "66666666",
      forfait: "Forfait Data 200GB",
      operator: "Orange",
      status: "available",
      createdDate: "2024-05-01",
    },
    {
      id: 10,
      simNumber: "8933011234567890132",
      ssid: "SIM010",
      pinCode: "7777",
      pukCode: "77777777",
      forfait: "Forfait Data 200GB",
      operator: "SFR",
      status: "assigned",
      assignedTo: "Emma Dubois",
      assignedPhone: "OnePlus 10",
      createdDate: "2024-05-15",
    },
    {
      id: 11,
      simNumber: "8933011234567890133",
      ssid: "SIM011",
      pinCode: "8888",
      pukCode: "88888888",
      forfait: "Forfait Pro 50GB",
      operator: "Bouygues",
      status: "assigned",
      assignedTo: "Paul Moreau",
      assignedPhone: "iPhone 12",
      createdDate: "2024-06-01",
    },
    {
      id: 12,
      simNumber: "8933011234567890134",
      ssid: "SIM012",
      pinCode: "9999",
      pukCode: "99999999",
      forfait: "Forfait Illimité",
      operator: "Free",
      status: "available",
      createdDate: "2024-06-10",
    },
  ])

  const [newSim, setNewSim] = useState({
    simNumber: "",
    ssid: "",
    pinCode: "",
    pukCode: "",
    forfait: "",
    operator: "",
  })

  const operators = ["Orange", "SFR", "Bouygues", "Free"]
  const forfaits = [
    "Forfait Standard 20GB",
    "Forfait Pro 50GB",
    "Forfait Business 100GB",
    "Forfait Illimité",
    "Forfait Data 200GB",
  ]

  const handleAddSim = async () => {
    if (
      !newSim.simNumber ||
      !newSim.ssid ||
      !newSim.pinCode ||
      !newSim.pukCode ||
      !newSim.forfait ||
      !newSim.operator
    ) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    // Validate SIM number uniqueness
    if (simCards.some((sim) => sim.simNumber === newSim.simNumber)) {
      toast({
        title: "Erreur de validation",
        description: "Ce numéro de SIM existe déjà.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const sim: SimCard = {
        id: simCards.length + 1,
        ...newSim,
        status: "available",
        createdDate: new Date().toISOString().split("T")[0],
      }

      setSimCards([...simCards, sim])
      setNewSim({ simNumber: "", ssid: "", pinCode: "", pukCode: "", forfait: "", operator: "" })
      setIsAddSimOpen(false)

      toast({
        title: "Carte SIM ajoutée avec succès",
        description: `La carte SIM ${sim.simNumber} a été ajoutée à l'inventaire.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'ajout de la carte SIM. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSim = async () => {
    if (!selectedSim) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSimCards(simCards.map((sim) => (sim.id === selectedSim.id ? selectedSim : sim)))

      setIsEditSimOpen(false)
      setSelectedSim(null)

      toast({
        title: "Carte SIM mise à jour avec succès",
        description: `La carte SIM ${selectedSim.simNumber} a été mise à jour.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de la carte SIM. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSim = async (simId: number) => {
    const simToDelete = simCards.find((s) => s.id === simId)

    if (simToDelete?.status === "assigned") {
      toast({
        title: "Suppression impossible",
        description: "Impossible de supprimer une carte SIM assignée. Veuillez d'abord la désassigner.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSimCards(simCards.filter((sim) => sim.id !== simId))

      toast({
        title: "Carte SIM supprimée",
        description: `La carte SIM ${simToDelete?.simNumber} a été supprimée de l'inventaire.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression de la carte SIM. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const csvContent = [
        ["Numéro SIM", "SSID", "Forfait", "Opérateur", "Statut", "Assigné à", "Téléphone", "Date de création"],
        ...filteredSimCards.map((sim) => [
          sim.simNumber,
          sim.ssid,
          sim.forfait,
          sim.operator,
          sim.status,
          sim.assignedTo || "Non assigné",
          sim.assignedPhone || "Aucun",
          sim.createdDate,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cartes-sim-export-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export réussi",
        description: "L'inventaire des cartes SIM a été exporté vers un fichier CSV.",
      })
    } catch (error) {
      toast({
        title: "Échec de l'export",
        description: "Échec de l'export des données. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const togglePinPukVisibility = (simId: number) => {
    setShowPinPuk((prev) => ({ ...prev, [simId]: !prev[simId] }))
  }

  const getStatusBadgeColor = (status: string) => {
    return status === "assigned"
      ? "bg-blue-100 text-blue-800 border-blue-300"
      : "bg-emerald-100 text-emerald-800 border-emerald-300"
  }

  const getOperatorColor = (operator: string) => {
    switch (operator) {
      case "Orange":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "SFR":
        return "bg-red-100 text-red-800 border-red-300"
      case "Bouygues":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Free":
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-slate-100 text-slate-800 border-slate-300"
    }
  }

  const filteredSimCards = simCards.filter((sim) => {
    const matchesSearch =
      sim.simNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.ssid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.forfait.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesOperator = filterOperator === "all" || sim.operator === filterOperator
    const matchesStatus = filterStatus === "all" || sim.status === filterStatus
    const matchesForfait = filterForfait === "all" || sim.forfait === filterForfait

    return matchesSearch && matchesOperator && matchesStatus && matchesForfait
  })

  // --- Analytics Data ---
  const operatorStats = operators.map((operator) => {
    const assigned = simCards.filter((sim) => sim.operator === operator && sim.status === "assigned").length;
    const available = simCards.filter((sim) => sim.operator === operator && sim.status === "available").length;
    return { operator, assigned, available };
  });
  const simStatusStats = [
    { name: "Attribuées", value: simCards.filter((sim) => sim.status === "assigned").length, color: "#3b82f6" },
    { name: "Disponibles", value: simCards.filter((sim) => sim.status === "available").length, color: "#10b981" },
  ];
  const forfaitStats = forfaits.map((forfait) => ({
    forfait,
    count: simCards.filter((sim) => sim.forfait === forfait).length,
  }));
  const userStats = Array.from(
    simCards.filter((sim) => sim.assignedTo).reduce((map, sim) => {
      map.set(sim.assignedTo!, (map.get(sim.assignedTo!) || 0) + 1);
      return map;
    }, new Map()),
  ).map(([user, count]) => ({ user, count }));
  const uniqueUsersWithSim = new Set(simCards.filter(sim => sim.assignedTo).map(sim => sim.assignedTo)).size;

  // SIM Assignment by Month
  function getMonthYear(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
  }
  const assignedSimByMonth = simCards
    .filter(sim => sim.status === "assigned")
    .reduce((acc, sim) => {
      const month = getMonthYear(sim.createdDate);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  const assignedSimByMonthData = Object.entries(assignedSimByMonth).map(([month, count]) => ({ month, count }));

  return (
    <div className="space-y-8">
      {/* SIM Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Inventory by Operator */}
        <Card className="shadow-soft border-0 bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Inventaire par Opérateur
                </CardTitle>
                <CardDescription className="text-slate-600 mt-1">
                  Répartition des cartes SIM par opérateur
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">
                  {operatorStats.reduce((sum, item) => sum + item.assigned + item.available, 0)}
                </div>
                <div className="text-sm text-slate-600">Total</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={operatorStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="operator" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assigned" stackId="a" fill="#3b82f6" />
                <Bar dataKey="available" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="shadow-soft border-0 bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Statut des Cartes SIM
                </CardTitle>
                <CardDescription className="text-slate-600 mt-1">
                  Distribution par statut d'utilisation
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+2.1%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={simStatusStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {simStatusStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {simStatusStats.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{item.value}</div>
                    <div className="text-xs text-slate-600">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forfait Distribution */}
        <Card className="shadow-soft border-0 bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Répartition par Forfait
            </CardTitle>
            <CardDescription className="text-slate-600 mt-1">
              Nombre de cartes SIM par forfait
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={forfaitStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="forfait" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SIM Assignment by Month */}
        <Card className="shadow-soft border-0 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-600" />
              Assignations SIM par Mois
            </CardTitle>
            <CardDescription className="text-slate-600 mt-1">
              Nombre de cartes SIM assignées chaque mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={assignedSimByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-semibold">Total Cartes SIM</p>
                <p className="text-3xl font-bold text-blue-900">{simCards.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-semibold">Disponibles</p>
                <p className="text-3xl font-bold text-emerald-900">
                  {simCards.filter((s) => s.status === "available").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Signal className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-sm font-semibold">Assignées</p>
                <p className="text-3xl font-bold text-orange-900">
                  {simCards.filter((s) => s.status === "assigned").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-semibold">Opérateurs</p>
                <p className="text-3xl font-bold text-purple-900">{new Set(simCards.map((s) => s.operator)).size}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800 text-xl">Cartes SIM ({filteredSimCards.length})</CardTitle>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </>
                )}
              </Button>

              <Dialog open={isAddSimOpen} onOpenChange={setIsAddSimOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une Carte SIM
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une Nouvelle Carte SIM</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="simNumber">Numéro SIM *</Label>
                        <Input
                          id="simNumber"
                          value={newSim.simNumber}
                          onChange={(e) => setNewSim({ ...newSim, simNumber: e.target.value })}
                          placeholder="8933011234567890123"
                          maxLength={19}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ssid">SSID *</Label>
                        <Input
                          id="ssid"
                          value={newSim.ssid}
                          onChange={(e) => setNewSim({ ...newSim, ssid: e.target.value })}
                          placeholder="SIM001"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pinCode">Code PIN *</Label>
                        <Input
                          id="pinCode"
                          type="password"
                          value={newSim.pinCode}
                          onChange={(e) => setNewSim({ ...newSim, pinCode: e.target.value })}
                          placeholder="1234"
                          maxLength={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pukCode">Code PUK *</Label>
                        <Input
                          id="pukCode"
                          type="password"
                          value={newSim.pukCode}
                          onChange={(e) => setNewSim({ ...newSim, pukCode: e.target.value })}
                          placeholder="12345678"
                          maxLength={8}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="operator">Opérateur *</Label>
                        <Select
                          value={newSim.operator}
                          onValueChange={(value) => setNewSim({ ...newSim, operator: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un opérateur" />
                          </SelectTrigger>
                          <SelectContent>
                            {operators.map((operator) => (
                              <SelectItem key={operator} value={operator}>
                                {operator}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="forfait">Forfait *</Label>
                        <Select
                          value={newSim.forfait}
                          onValueChange={(value) => setNewSim({ ...newSim, forfait: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un forfait" />
                          </SelectTrigger>
                          <SelectContent>
                            {forfaits.map((forfait) => (
                              <SelectItem key={forfait} value={forfait}>
                                {forfait}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddSimOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddSim} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Ajout en cours...
                        </>
                      ) : (
                        "Ajouter la Carte SIM"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par numéro SIM, SSID ou forfait..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            <Select value={filterOperator} onValueChange={setFilterOperator}>
              <SelectTrigger className="w-full sm:w-48 border-slate-200">
                <SelectValue placeholder="Opérateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les opérateurs</SelectItem>
                {operators.map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32 border-slate-200">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="assigned">Assignée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterForfait} onValueChange={setFilterForfait}>
              <SelectTrigger className="w-full sm:w-48 border-slate-200">
                <SelectValue placeholder="Forfait" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les forfaits</SelectItem>
                {forfaits.map((forfait) => (
                  <SelectItem key={forfait} value={forfait}>
                    {forfait}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50/50">
                  <TableHead className="text-slate-700 font-semibold">Numéro SIM</TableHead>
                  <TableHead className="text-slate-700 font-semibold">SSID</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Codes</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Opérateur</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Forfait</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Statut</TableHead>
                  <TableHead className="text-slate-700 font-semibold w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSimCards.map((sim, index) => (
                  <TableRow
                    key={sim.id}
                    className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeInUp 0.4s ease-out forwards",
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center border border-blue-100">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-mono text-sm text-slate-800">{sim.simNumber}</p>
                          <p className="text-xs text-slate-500">Créée le {sim.createdDate}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 font-medium">{sim.ssid}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">
                          <p className="text-slate-600">PIN: {showPinPuk[sim.id] ? sim.pinCode : "••••"}</p>
                          <p className="text-slate-600">PUK: {showPinPuk[sim.id] ? sim.pukCode : "••••••••"}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePinPukVisibility(sim.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPinPuk[sim.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getOperatorColor(sim.operator)} border font-medium`}>{sim.operator}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-700">{sim.forfait}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(sim.status)} border font-medium capitalize`}>
                        {sim.status === "assigned" ? "Assignée" : "Disponible"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-slate-200 shadow-lg">
                          <DropdownMenuItem
                            className="text-slate-700 hover:bg-slate-50"
                            onClick={() => {
                              setSelectedSim(sim)
                              setIsEditSimOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          {sim.status === "available" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 hover:bg-red-50"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action ne peut pas être annulée. Cela supprimera définitivement la carte SIM{" "}
                                    {sim.simNumber}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSim(sim.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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

      {/* Edit SIM Dialog */}
      <Dialog open={isEditSimOpen} onOpenChange={setIsEditSimOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier la Carte SIM</DialogTitle>
          </DialogHeader>
          {selectedSim && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-simNumber">Numéro SIM *</Label>
                  <Input
                    id="edit-simNumber"
                    value={selectedSim.simNumber}
                    onChange={(e) => setSelectedSim({ ...selectedSim, simNumber: e.target.value })}
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-ssid">SSID *</Label>
                  <Input
                    id="edit-ssid"
                    value={selectedSim.ssid}
                    onChange={(e) => setSelectedSim({ ...selectedSim, ssid: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pinCode">Code PIN *</Label>
                  <Input
                    id="edit-pinCode"
                    type="password"
                    value={selectedSim.pinCode}
                    onChange={(e) => setSelectedSim({ ...selectedSim, pinCode: e.target.value })}
                    maxLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pukCode">Code PUK *</Label>
                  <Input
                    id="edit-pukCode"
                    type="password"
                    value={selectedSim.pukCode}
                    onChange={(e) => setSelectedSim({ ...selectedSim, pukCode: e.target.value })}
                    maxLength={8}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-operator">Opérateur *</Label>
                  <Select
                    value={selectedSim.operator}
                    onValueChange={(value) => setSelectedSim({ ...selectedSim, operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((operator) => (
                        <SelectItem key={operator} value={operator}>
                          {operator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-forfait">Forfait *</Label>
                  <Select
                    value={selectedSim.forfait}
                    onValueChange={(value) => setSelectedSim({ ...selectedSim, forfait: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {forfaits.map((forfait) => (
                        <SelectItem key={forfait} value={forfait}>
                          {forfait}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSimOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditSim} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à Jour"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
