import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'
// React lazy importing loses generics, so import this directly
import Select from './fields-ui/select'

const TextInput = lazy(() => import('./fields-ui/text-input'))
const TanStackFormSubmitButton = lazy(() => import('./form-ui/submit-button'))
const TanStackFormElement = lazy(() => import('./form-ui/form'))
const Field = lazy(() => import('./fields-ui/field'))
const Label = lazy(() => import('./fields-ui/label'))
const Error = lazy(() => import('./fields-ui/error'))
const Description = lazy(() => import('./fields-ui/description'))
const DateRangePicker = lazy(() => import('./fields-ui/date-range-picker'))
const IntegerSlider = lazy(() => import('./fields-ui/integer-slider'))

const NumberInput = lazy(() => import('./fields-ui/number-input'))
const Checkbox = lazy(() => import('./fields-ui/checkbox'))
const TextArea = lazy(() => import('./fields-ui/text-area'))

const TextInputField = lazy(() => import('./wrappers/text-field'))

export const { appFormOptions, useSchemaAppForm } = createFormHook({
  fieldComponents: {
    // Granular elements for when you need full control
    TextInput,
    Field,
    Label,
    Error,
    Description,
    TextArea,
    Checkbox,
    NumberInput,
    Select,
    IntegerSlider,

    // General wrappers for the usual cases
    TextInputField,
    DateRangePicker,
  },
  formComponents: {
    SubmitButton: TanStackFormSubmitButton,
    Form: TanStackFormElement,
  },
})
