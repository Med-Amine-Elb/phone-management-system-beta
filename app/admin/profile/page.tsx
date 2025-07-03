"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AdminProfilePage() {
  // Mock user data (replace with real data from context or API)
  const [profile, setProfile] = useState({
    name: "Administrateur",
    email: "admin@entreprise.fr",
    password: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate save
    setTimeout(() => setIsSaving(false), 1200)
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon Profil</h1>
            <p className="text-slate-600">Gérez les informations de votre compte administrateur</p>
          </div>
        </div>

        {/* Profile Card & Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Summary Card */}
          <Card className="shadow-soft border-0 bg-gradient-to-br from-white to-blue-50/30 flex flex-col items-center p-8">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">{profile.name}</CardTitle>
              <CardDescription className="text-slate-600">{profile.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-sm text-slate-500">Rôle: Administrateur</div>
            </CardContent>
          </Card>

          {/* Profile Edit Form */}
          <Card className="shadow-soft border-0 bg-gradient-to-br from-white to-emerald-50/30 p-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Modifier mes paramètres</CardTitle>
              <CardDescription className="text-slate-600">Mettez à jour vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSave}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <Input name="name" value={profile.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <Input name="email" type="email" value={profile.email} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                  <Input name="password" type="password" value={profile.password} onChange={handleChange} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg" disabled={isSaving}>
                  {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 