import { lazy } from 'react'
import { bookingFormOptions, formGroupId } from './shared-form'
import { BookingStepCard } from './booking-step-card'
import type { BookingForm } from './shared-form'
import { useSchemaAppForm } from '@/components/form/app-form'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStepper } from '@/hooks/useStepper'

const GuestDetailsCard = lazy(() => import('./guest-details-card'))
const StayDatesCard = lazy(() => import('./stay-dates-card'))
const RoomPreferencesCard = lazy(() => import('./room-preferences-card'))
const BudgetCard = lazy(() => import('./budget-card'))
const AddOnsCard = lazy(() => import('./add-ons-card'))
const SpecialRequestsCard = lazy(() => import('./special-requests-card'))
const BookingSummaryCard = lazy(() => import('./booking-summary-card'))

interface CardStepHeaderProps {
  step: number
}

function CardStepHeader({ step }: CardStepHeaderProps) {
  let title: string
  let description: string
  switch (step) {
    case 0:
      title = 'Guest details'
      description = 'Tell us who is staying.'
      break
    case 1:
      title = 'Stay dates'
      description = 'Choose your check-in and check-out dates.'
      break
    case 2:
      title = 'Room preferences'
      description = 'Select the room details that suit you.'
      break
    case 3:
      title = 'Budget'
      description = 'Set your preferred nightly maximum.'
      break
    case 4:
      title = 'Add-ons'
      description = 'Add services to your stay.'
      break
    case 5:
      title = 'Special requests'
      description = 'Share any details we should know before your stay.'
      break
    case 6:
    default:
      title = 'Review booking'
      description = 'Confirm all details before requesting your booking.'
      break
  }

  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        Step {step + 1} of 7: {description}
      </CardDescription>
    </CardHeader>
  )
}

interface CardSwitcherProps {
  form: BookingForm
  step: number
  onNext: () => void
}

function CardSwitcher({ form, step, onNext }: CardSwitcherProps) {
  switch (step) {
    case 0:
      return <GuestDetailsCard form={form} onGroupSubmit={onNext} />
    case 1:
      return <StayDatesCard form={form} onGroupSubmit={onNext} />
    case 2:
      return <RoomPreferencesCard form={form} onGroupSubmit={onNext} />
    case 3:
      return <BudgetCard form={form} onGroupSubmit={onNext} />
    case 4:
      return <AddOnsCard form={form} onGroupSubmit={onNext} />
    case 5:
      return <SpecialRequestsCard form={form} onGroupSubmit={onNext} />
    case 6:
      return <BookingSummaryCard form={form} />
  }
}

export function BookingForm() {
  const { step, toPreviousStep, toNextStep, isFirstStep, isLastStep } =
    useStepper(0, 6)
  const form = useSchemaAppForm(bookingFormOptions)

  return (
    <form.AppForm>
      <BookingStepCard currentStep={step}>
        <CardStepHeader step={step} />
        <CardContent data-findme>
          <CardSwitcher form={form} step={step} onNext={toNextStep} />
        </CardContent>
        <CardFooter className="mt-auto rounded-bl-none">
          {!isFirstStep && (
            <Button type="button" variant="outline" onClick={toPreviousStep}>
              Back
            </Button>
          )}
          {isLastStep && (
            <form.SubmitButton className="ms-auto">
              Request booking
            </form.SubmitButton>
          )}
          {!isLastStep && (
            <Button className="ms-auto" type="submit" form={formGroupId}>
              Continue
            </Button>
          )}
        </CardFooter>
      </BookingStepCard>
    </form.AppForm>
  )
}
