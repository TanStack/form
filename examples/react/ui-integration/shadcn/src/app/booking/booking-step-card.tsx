import {
  BedDouble,
  CalendarDays,
  ClipboardCheck,
  MessageSquareText,
  PlusCircle,
  UserRound,
  Wallet,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/helpers/utils'

interface BookingStep {
  label: string
  icon: LucideIcon
}

const bookingSteps: Array<BookingStep> = [
  { label: 'Guest details', icon: UserRound },
  { label: 'Stay dates', icon: CalendarDays },
  { label: 'Room preferences', icon: BedDouble },
  { label: 'Budget', icon: Wallet },
  { label: 'Add-ons', icon: PlusCircle },
  { label: 'Special requests', icon: MessageSquareText },
  { label: 'Review booking', icon: ClipboardCheck },
]

interface BookingStepCardProps {
  currentStep: number
  children: ReactNode
}

export function BookingStepCard({
  currentStep,
  children,
}: BookingStepCardProps) {
  return (
    <Card className="gap-0 py-0 md:flex-row">
      <aside className="border-b bg-muted/40 p-4 md:w-56 md:shrink-0 md:border-r md:border-b-0">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Your booking
        </p>
        <nav aria-label="Booking steps">
          <ol className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
            {bookingSteps.map(({ label, icon: Icon }, index) => {
              const isCurrent = index === currentStep
              const isComplete = index < currentStep

              return (
                <li
                  key={label}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground',
                    isCurrent &&
                      'bg-background font-medium text-foreground shadow-sm',
                    isComplete && 'text-foreground',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4',
                      isCurrent && 'text-primary',
                      isComplete && 'text-muted-foreground',
                    )}
                  />
                  <span>{label}</span>
                </li>
              )
            })}
          </ol>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-4 pt-4">{children}</div>
    </Card>
  )
}
