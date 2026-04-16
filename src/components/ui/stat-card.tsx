
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className
}: StatCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
            className
        )}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1">
                            <span className={cn(
                                "text-sm font-medium",
                                trend.isPositive ? "text-green-600" : "text-destructive"
                            )}>
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </span>
                            <span className="text-sm text-muted-foreground">vs last month</span>
                        </div>
                    )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
            {/* Decorative gradient */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
        </div>
    )
}
