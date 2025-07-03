import DashboardLayout from "@/components/layout/dashboard-layout"
import SimCardManagement from "@/components/sim-cards/sim-card-management"

export default function SimCardsPage() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestion des Cartes SIM</h1>
            <p className="text-slate-600">Gérez votre inventaire de cartes SIM et suivez leurs attributions</p>
          </div>
        </div>

        {/* SIM Card Management */}
        <SimCardManagement />
      </div>
    </DashboardLayout>
  )
}
