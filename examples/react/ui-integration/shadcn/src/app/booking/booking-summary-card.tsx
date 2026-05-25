import { format } from 'date-fns'
import type { BookingForm } from './shared-form'

import { Separator } from '@/components/ui/separator'

interface BookingSummaryCardProps {
  form: BookingForm
}

function formatSelection(value: string) {
  return (
    value
      .split('-')
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(' ')
  )
}

function BookingSummaryCard({ form }: BookingSummaryCardProps) {
  return (
    <form.Form>
      <form.Subscribe selector={(state) => state.values}>
        {(values) => {
          const { from, to } = values.stayDates.dateRange
          const addOns = [
            values.addOns.includeBreakfast && 'Breakfast',
            values.addOns.airportPickup && 'Airport pickup',
            values.addOns.parkingRequired && 'Parking',
          ].filter(Boolean)

          return (
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="mb-2 font-medium">Guest</h3>
                <p>{values.guestDetails.name}</p>
                <p className="text-muted-foreground">
                  {values.guestDetails.email} |{' '}
                  {values.guestDetails.phoneNumber}
                </p>
                <p className="text-muted-foreground">
                  {values.guestDetails.guestCount}{' '}
                  {values.guestDetails.guestCount === 1 ? 'guest' : 'guests'}
                </p>
              </section>
              <Separator />
              <section className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Stay</h3>
                  <p>
                    {from && to
                      ? `${format(from, 'PPP')} - ${format(to, 'PPP')}`
                      : 'No dates selected'}
                  </p>
                  <p className="text-muted-foreground">
                    Arrival at {values.stayDates.arrivalTime}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Room</h3>
                  <p>{formatSelection(values.roomPreferences.roomType)} room</p>
                  <p className="text-muted-foreground">
                    {formatSelection(values.roomPreferences.bedPreference)} bed,{' '}
                    {formatSelection(values.roomPreferences.smokingPreference)}
                  </p>
                  <p className="text-muted-foreground">
                    {formatSelection(values.roomPreferences.floorPreference)}
                  </p>
                </div>
              </section>
              <Separator />
              <section className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Budget</h3>
                  <p>
                    {values.budget.currency} {values.budget.maxNightlyBudget}{' '}
                    per night
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Add-ons</h3>
                  <p>
                    {addOns.length ? addOns.join(', ') : 'No add-ons selected'}
                  </p>
                </div>
              </section>
              <Separator />
              <section>
                <h3 className="mb-2 font-medium">Special requests</h3>
                <p className="text-muted-foreground">
                  {values.specialRequests.notes || 'No special requests added.'}
                </p>
              </section>
            </div>
          )
        }}
      </form.Subscribe>
    </form.Form>
  )
}

export default BookingSummaryCard
