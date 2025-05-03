import { AccountsOverview } from "@/components/dashboard/accounts-overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickBillPay } from "@/components/dashboard/quick-bill-pay"
import { BusinessMetrics } from "@/components/dashboard/business-metrics"

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <AccountsOverview />
                </div>
                <div className="lg:col-span-1">
                    <RecentTransactions />
                </div>
                <div className="lg:col-span-1">
                    <QuickBillPay />
                </div>
            </div>

            <BusinessMetrics />
        </div>
    )
}
