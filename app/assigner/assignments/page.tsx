import DashboardLayout from "@/components/layout/dashboard-layout"
import AssignmentTrendsChart from "@/components/charts/assignment-trends-chart"
import AssignerAssignmentManagement from "@/components/assignments/assigner-assignment-management"

export default function AssignmentsPage() {
  return (
    <DashboardLayout userRole="assigner">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestion des Attributions</h1>
            <p className="text-slate-600">Consultez et créez de nouvelles attributions de téléphones pour les utilisateurs. (Modification et suppression désactivées)</p>
          </div>
        </div>

        {/* Enhanced Assignment Trends Chart */}
        <AssignmentTrendsChart />

        {/* Assignment Management (assign/view only) */}
        <AssignerAssignmentManagement />
      </div>
    </DashboardLayout>
  )
} 