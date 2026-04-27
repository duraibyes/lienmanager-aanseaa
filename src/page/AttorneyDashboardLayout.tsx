import { HeaderAttorney } from '@/components/layout/attorney/HeaderAttorney'
import React from 'react'

const AttorneyDashboardLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-screen bg-background">
            <HeaderAttorney />
            <main>
                {children}
            </main>
        </div>
    )
}

export default AttorneyDashboardLayout