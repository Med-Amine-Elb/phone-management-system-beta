"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import {
  Calendar,
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Smartphone,
  UserCheck,
  Clock,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportsManagement() {
  const [dateRange, setDateRange] = useState("last30days")
  const [reportType, setReportType] = useState("assignments")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [downloadingReports, setDownloadingReports] = useState<number[]>([])
  const { toast } = useToast()

  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Q1 2024 Assignment Report",
      type: "Assignment Summary",
      generatedDate: "2024-01-20",
      size: "2.4 MB",
      format: "PDF",
      status: "completed",
    },
    {
      id: 2,
      name: "January Device Inventory",
      type: "Device Inventory",
      generatedDate: "2024-01-19",
      size: "1.8 MB",
      format: "Excel",
      status: "completed",
    },
    {
      id: 3,
      name: "User Activity Analysis",
      type: "User Activity",
      generatedDate: "2024-01-18",
      size: "3.2 MB",
      format: "PDF",
      status: "processing",
    },
    {
      id: 4,
      name: "Cost Analysis Q4 2023",
      type: "Cost Analysis",
      generatedDate: "2024-01-15",
      size: "1.5 MB",
      format: "Excel",
      status: "completed",
    },
  ])

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Validation Error",
        description: "Please select a report type.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newReport = {
        id: reports.length + 1,
        name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        type:
          reportType === "assignments"
            ? "Assignment Summary"
            : reportType === "inventory"
              ? "Device Inventory"
              : reportType === "users"
                ? "User Activity"
                : reportType === "cost"
                  ? "Cost Analysis"
                  : reportType === "sim-inventory"
                    ? "SIM Card Inventory"
                    : "Other",
        generatedDate: new Date().toISOString().split("T")[0],
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        format: Math.random() > 0.5 ? "PDF" : "Excel",
        status: "completed",
      }

      setReports([newReport, ...reports])

      toast({
        title: "Report Generated Successfully",
        description: `Your ${newReport.type.toLowerCase()} report has been generated and is ready for download.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async (reportId: number) => {
    setDownloadingReports([...downloadingReports, reportId])
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const report = reports.find((r) => r.id === reportId)

      // Simulate file download
      const blob = new Blob(["Sample report content"], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${report?.name}.${report?.format.toLowerCase()}`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download Started",
        description: `${report?.name} is being downloaded.`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingReports(downloadingReports.filter((id) => id !== reportId))
    }
  }

  const handleScheduleReport = async () => {
    setIsScheduleOpen(false)
    toast({
      title: "Report Scheduled",
      description: "Your report has been scheduled for automatic generation.",
    })
  }

  const reportTemplates = [
    {
      id: 1,
      name: "Assignment Summary",
      description: "Overview of all phone assignments by department and status",
      icon: UserCheck,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      lastGenerated: "2024-01-20",
      frequency: "Weekly",
    },
    {
      id: 2,
      name: "Device Inventory",
      description: "Complete inventory report with device status and conditions",
      icon: Smartphone,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      lastGenerated: "2024-01-19",
      frequency: "Monthly",
    },
    {
      id: 3,
      name: "User Activity",
      description: "User assignment history and device usage patterns",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      lastGenerated: "2024-01-18",
      frequency: "Bi-weekly",
    },
    {
      id: 4,
      name: "Cost Analysis",
      description: "Financial analysis of device costs and depreciation",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      lastGenerated: "2024-01-15",
      frequency: "Quarterly",
    },
    {
      id: 5,
      name: "SIM Card Inventory",
      description: "Complete inventory report of all SIM cards, their status, operator, and plan",
      icon: Smartphone,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "from-cyan-50 to-cyan-100",
      lastGenerated: "2024-01-22",
      frequency: "Monthly",
    },
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "processing":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "failed":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Reports & Analytics</h1>
          <p className="text-slate-600">Generate comprehensive reports and analyze your phone management data</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Reports</p>
                <p className="text-3xl font-bold text-slate-800">156</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-slate-800">23</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Scheduled</p>
                <p className="text-3xl font-bold text-slate-800">8</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Processing</p>
                <p className="text-3xl font-bold text-slate-800">2</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Generator */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800 text-xl">Generate New Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reportType" className="text-slate-700 font-medium">
                Report Type
              </Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignments">Assignment Summary</SelectItem>
                  <SelectItem value="inventory">Device Inventory</SelectItem>
                  <SelectItem value="users">User Activity</SelectItem>
                  <SelectItem value="costs">Cost Analysis</SelectItem>
                  <SelectItem value="sim-inventory">SIM Card Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange" className="text-slate-700 font-medium">
                Date Range
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last3months">Last 3 Months</SelectItem>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-700 font-medium">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  className="bg-slate-50 border-slate-200 text-slate-800"
                  disabled={dateRange !== "custom"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-700 font-medium">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  className="bg-slate-50 border-slate-200 text-slate-800"
                  disabled={dateRange !== "custom"}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Report</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Recipients</Label>
                      <Input placeholder="admin@company.com, manager@company.com" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleScheduleReport}>Schedule Report</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800 text-xl">Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template, index) => {
                const Icon = template.icon
                return (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${template.bgColor} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 bg-gradient-to-r ${template.color} bg-clip-text text-transparent`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{template.name}</h3>
                        <p className="text-sm text-slate-500">{template.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-slate-400">Last: {template.lastGenerated}</span>
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                            {template.frequency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setReportType(template.name.toLowerCase().replace(" ", ""))
                        handleGenerateReport()
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-800 text-xl">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{report.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-slate-500">{report.type}</span>
                      <span className="text-sm text-slate-400">•</span>
                      <span className="text-sm text-slate-400">{report.generatedDate}</span>
                      <span className="text-sm text-slate-400">•</span>
                      <span className="text-sm text-slate-400">{report.size}</span>
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">{report.format}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusBadgeColor(report.status)} border font-medium capitalize`}>
                    {report.status}
                  </Badge>
                  {report.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50"
                      onClick={() => handleDownloadReport(report.id)}
                      disabled={downloadingReports.includes(report.id)}
                    >
                      {downloadingReports.includes(report.id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
