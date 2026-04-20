import { Header } from "@/components/layout/header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen bg-background">
            <Header />
            <main>
                {children}
            </main>
        </div>
    )
}
