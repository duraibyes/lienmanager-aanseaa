import { cn } from "@/lib/utils"

interface TypographyProps {
    children: React.ReactNode
    className?: string
}

export function PageTitle({ children, className }: TypographyProps) {
    return (
        <h1 className={cn(
            "text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground",
            className
        )}>
            {children}
        </h1>
    )
}

export function PageSubtitle({ children, className }: TypographyProps) {
    return (
        <p className={cn(
            "text-lg text-muted-foreground leading-relaxed",
            className
        )}>
            {children}
        </p>
    )
}

export function SectionTitle({ children, className }: TypographyProps) {
    return (
        <h2 className={cn(
            "text-2xl font-semibold tracking-tight text-foreground",
            className
        )}>
            {children}
        </h2>
    )
}

export function SectionSubtitle({ children, className }: TypographyProps) {
    return (
        <h3 className={cn(
            "text-lg font-medium text-foreground",
            className
        )}>
            {children}
        </h3>
    )
}

export function CardTitle({ children, className }: TypographyProps) {
    return (
        <h4 className={cn(
            "text-base font-semibold text-foreground",
            className
        )}>
            {children}
        </h4>
    )
}

export function Label({ children, className }: TypographyProps) {
    return (
        <span className={cn(
            "text-sm font-medium text-muted-foreground uppercase tracking-wide",
            className
        )}>
            {children}
        </span>
    )
}

export function BodyText({ children, className }: TypographyProps) {
    return (
        <p className={cn(
            "text-base text-foreground leading-relaxed",
            className
        )}>
            {children}
        </p>
    )
}

export function SmallText({ children, className }: TypographyProps) {
    return (
        <span className={cn(
            "text-sm text-muted-foreground",
            className
        )}>
            {children}
        </span>
    )
}
