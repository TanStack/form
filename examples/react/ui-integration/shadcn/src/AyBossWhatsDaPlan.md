# Form proposal

Hotel checkin

## Basic details

| Field            | Example values | Component              |
| ---------------- | -------------- | ---------------------- |
| Guest name       | “Luca Jakob”   | `Input`                |
| Number of guests | `1–6`          | `Input type="number"`  |
| Check-in date    | Calendar date  | `Popover` + `Calendar` |

## Room preferences

| Field              | Example values                     | Component    |
| ------------------ | ---------------------------------- | ------------ |
| Room type          | Standard, Deluxe, Suite, Penthouse | `Select`     |
| Bed preference     | Single, Queen, King, Twin beds     | `RadioGroup` |
| Max nightly budget | CHF 100–800                        | `Slider`     |

## Extras

| Field             | Example values                                               | Component        |
| ----------------- | ------------------------------------------------------------ | ---------------- |
| Include breakfast | true / false                                                 | `Checkbox`       |
| Priority requests | “Quiet room”, “High floor”, “Late checkout”, “Near elevator” | Reorderable list |

# Structure

```ts
type HotelStayPreferencesForm = {
  guestName: string
  guestCount: number
  checkInDate: Date
  roomType: 'standard' | 'deluxe' | 'suite' | 'penthouse'
  bedPreference: 'single' | 'queen' | 'king' | 'twin'
  maxNightlyBudget: number
  includeBreakfast: boolean
  priorityRequests: string[]
}
```
