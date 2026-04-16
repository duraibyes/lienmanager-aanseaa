import { cn } from "@/lib/utils"

interface PageWrapperProps {
    children: React.ReactNode
    className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
    return (
        <main className={cn(
            "min-h-screen bg-background",
            className
        )}>
            {children}
        </main>
    )
}

export function PageContainer({ children, className }: PageWrapperProps) {
    return (
        <div className={cn(
            "container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8",
            className
        )}>
            {children}
        </div>
    )
}

export function PageHeader({ children, className }: PageWrapperProps) {
    return (
        <header className={cn(
            "mb-8",
            className
        )}>
            {children}
        </header>
    )
}

export function PageContent({ children, className }: PageWrapperProps) {
    return (
        <div className={cn(
            "space-y-6",
            className
        )}>
            {children}
        </div>
    )
}
