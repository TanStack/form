import { bookingFormOptions } from './shared-form'
import { GuestDetailsCard } from './guest-details-card'
import { StayDatesCard } from './stay-dates-card'
import { useSchemaAppForm } from '@/components/form/app-form'

// type HotelStayPreferencesForm = {
//   // Guest Details
//   guestName: string
//   guestEmail: string
//   guestPhone: string
//   guestCount: number

//   // Stay Dates
//   checkInDate: Date
//   checkOutDate: Date
//   arrivalTime: string

//   // Room Preferences
//   roomType: 'standard' | 'deluxe' | 'suite' | 'penthouse'
//   bedPreference: 'single' | 'queen' | 'king' | 'twin'
//   smokingPreference: 'non-smoking' | 'smoking'
//   floorPreference: 'low' | 'high' | 'no-preference'

//   // Budget
//   maxNightlyBudget: number
//   currency: 'USD' | 'EUR' | 'GBP'

//   // Add-ons
//   includeBreakfast: boolean
//   airportPickup: boolean
//   parkingRequired: boolean

//   // Special Requests
//   specialRequests: string
// }

export function BookingForm() {
  const form = useSchemaAppForm(bookingFormOptions)

  return (
    <form.AppForm>
      <GuestDetailsCard form={form} />
      <StayDatesCard form={form} />
    </form.AppForm>
  )
}
