"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { CreditCard } from "lucide-react";

// Mock data: Replace with real data from your backend or state
const simAssignmentTrends = [
  { month: "Janv", assigned: 2, available: 2 },
  { month: "Févr", assigned: 3, available: 1 },
  { month: "Mars", assigned: 4, available: 2 },
  { month: "Avr", assigned: 4, available: 3 },
  { month: "Mai", assigned: 5, available: 2 },
  { month: "Juin", assigned: 6, available: 2 },
];

export default function SimAssignmentTrendsChart() {
  return (
    <Card className="shadow-soft border-0 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Évolution des Attributions SIM
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">
          Nombre de cartes SIM assignées et disponibles par mois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={simAssignmentTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="assigned" stroke="#3b82f6" strokeWidth={2} name="Assignées" />
            <Line type="monotone" dataKey="available" stroke="#10b981" strokeWidth={2} name="Disponibles" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 