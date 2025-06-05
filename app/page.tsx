import { WelcomeCard } from "@/components/welcome-card"
import { ReceivedKeysCard } from "@/components/dashboard/received-keys-card"
import { BalanceKeysCard } from "@/components/dashboard/balance-keys-card"
import { RetailerCountCard } from "@/components/dashboard/retailer-count-card"
import { DailyActivationsCard } from "@/components/dashboard/daily-activations-card"

export default function Home() {
  return (
    <div className="responsive-container py-4 sm:py-8">
      <WelcomeCard />

      {/* First Row - Key Management */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        <ReceivedKeysCard />
        <BalanceKeysCard />
      </div>

      {/* Second Row - Business Metrics */}
      <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <RetailerCountCard />
        <DailyActivationsCard />
      </div>
    </div>
  )
}
