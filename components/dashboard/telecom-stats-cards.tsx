"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Smartphone, UserCheck, Phone, CreditCard } from "lucide-react"

export default function TelecomStatsCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPhones: 0,
    activeAssignments: 0,
    availablePhones: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 156,
        totalPhones: 89,
        activeAssignments: 67,
        availablePhones: 22,
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const cards = [
    {
      title: "Total Utilisateurs",
      subtitle: "Mois dernier",
      value: stats.totalUsers,
      change: "+22.45%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-400",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Inventaire Téléphones",
      subtitle: "Inventaire actuel",
      value: stats.totalPhones,
      change: "+22.45%",
      trend: "up",
      icon: Smartphone,
      color: "from-emerald-500 to-teal-400",
      bgColor: "from-emerald-50 to-teal-50",
    },
    {
      title: "Attributions Actives",
      subtitle: "En cours",
      value: stats.activeAssignments,
      change: "+222.45%",
      trend: "up",
      icon: UserCheck,
      color: "from-orange-500 to-amber-400",
      bgColor: "from-orange-50 to-amber-50",
    },
    {
      title: "Téléphones Disponibles",
      subtitle: "Prêts à attribuer",
      value: stats.availablePhones,
      change: "+22.45%",
      trend: "up",
      icon: Phone,
      color: "from-purple-500 to-indigo-400",
      bgColor: "from-purple-50 to-indigo-50",
    },
  ]

  // Mock value for total SIM cards (replace with real data if available)
  const totalSimCards = 12;

  // Add SIM card stat card to the cards array for unified design and row layout
  const cardsWithSim = [
    ...cards,
    {
      title: "Total Cartes SIM",
      subtitle: "Inventaire SIM",
      value: totalSimCards,
      change: "+12.00%",
      trend: "up",
      icon: CreditCard,
      color: "from-cyan-500 to-blue-400",
      bgColor: "from-cyan-50 to-blue-50",
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50/60 p-6 shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {cardsWithSim.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="relative overflow-hidden bg-white border-0 shadow-soft hover:shadow-xl transition-all duration-300 group rounded-2xl"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isLoading ? "none" : "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-60`} />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {card.change}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600">{card.title}</p>
                  <p className="text-xs text-slate-500">{card.subtitle}</p>
                  <div className="text-2xl font-bold text-slate-900">
                    {isLoading ? (
                      <div className="animate-pulse bg-slate-200 rounded w-16 h-8"></div>
                    ) : (
                      <CountUp end={card.value} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function CountUp({ end }: { end: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 50
    const increment = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end])

  return <span>{count.toLocaleString()}</span>
}
