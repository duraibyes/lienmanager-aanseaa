import { PageContainer, PageHeader } from "@/components/layout/page-wrapper"
import { PageTitle, PageSubtitle } from "@/components/ui/typography"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2
} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Link } from "react-router-dom"

// Mock data for dashboard
const stats = [
  {
    title: "Total Projects",
    value: 24,
    icon: FolderKanban,
    trend: { value: 12, isPositive: true },
    description: "8 active this month"
  },
  {
    title: "Active Tasks",
    value: 47,
    icon: CheckSquare,
    trend: { value: 5, isPositive: true },
    description: "15 due this week"
  },
  {
    title: "Contacts",
    value: 156,
    icon: Users,
    trend: { value: 8, isPositive: true },
    description: "12 new this month"
  },
  {
    title: "Upcoming Deadlines",
    value: 7,
    icon: Calendar,
    description: "Next: 3 days"
  },
]

const recentProjects = [
  {
    id: 1,
    name: "Downtown Office Complex",
    status: "active",
    deadline: "May 15, 2026",
    progress: 65
  },
  {
    id: 2,
    name: "Riverside Apartments",
    status: "active",
    deadline: "Jun 20, 2026",
    progress: 40
  },
  {
    id: 3,
    name: "Tech Park Phase 2",
    status: "pending",
    deadline: "Jul 1, 2026",
    progress: 25
  },
  {
    id: 4,
    name: "City Hall Renovation",
    status: "active",
    deadline: "Apr 30, 2026",
    progress: 80
  },
]

const deadlineData = [
  { name: "Overdue", value: 2, color: "var(--destructive)" },
  { name: "Due Soon", value: 5, color: "var(--accent)" },
  { name: "On Track", value: 18, color: "var(--primary)" },
]

const taskProgressData = [
  { month: "Jan", completed: 45, pending: 12 },
  { month: "Feb", completed: 52, pending: 8 },
  { month: "Mar", completed: 48, pending: 15 },
  { month: "Apr", completed: 61, pending: 10 },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--primary)",
  },
  pending: {
    label: "Pending",
    color: "var(--muted-foreground)",
  },
}

export default function DashboardPage() {

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <PageTitle>Dashboard</PageTitle>
            <PageSubtitle className="mt-1">
              Welcome back! Here&apos;s an overview of your projects.
            </PageSubtitle>
          </div>
          <Link to="/project/create">
            <Button className="gradient-primary hover:opacity-90">
              New Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Task Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Task Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskProgressData}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="completed"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    fill="var(--muted-foreground)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Deadline Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Deadline Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deadlineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deadlineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {deadlineData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Recent Projects
          </CardTitle>
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col md:flex-row items-start gap-4 md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-row items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{project.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Due: {project.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col w-full justify-between items-end gap-4">
                  <div className="sm:block">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {project.progress}% complete
                    </span>
                  </div>

                  <Badge
                    variant={project.status === "active" ? "default" : "secondary"}
                    className={project.status === "active" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                  >
                    {project.status === "active" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
