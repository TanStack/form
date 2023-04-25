//
import type { DeepKeys, DeepValue, RequiredByKey, Updater } from './utils'
import type { FormApi, ValidationError } from './FormApi'
import { Store } from '@tanstack/store'

export type FieldOptions<TData, TFormData> = {
  name: unknown extends TFormData ? string : DeepKeys<TFormData>
  defaultValue?: TData
  form?: FormApi<TFormData>
  validate?: (
    value: TData,
    fieldApi: FieldApi<TData, TFormData>,
  ) => ValidationError | Promise<ValidationError>
  validatePristine?: boolean
  filterValue?: (value: TData) => TData
  defaultMeta?: Partial<FieldMeta>
  validateOn?:
    | 'change'
    | 'blur'
    | 'change-blur'
    | 'change-submit'
    | 'blur-submit'
    | 'submit'
}

export type FieldMeta = {
  isTouched: boolean
  touchedError?: ValidationError
  error?: ValidationError
  isValidating: boolean
}

export type ChangeProps<TData> = {
  onChange: (updater: Updater<TData>) => void
  onBlur: (event: any) => void
}

export type InputProps = {
  onChange: (event: any) => void
  onBlur: (event: any) => void
}

export type FieldApiOptions<TData, TFormData> = RequiredByKey<
  FieldOptions<TData, TFormData>,
  'form'
>

let uid = 0

export type FieldState<TData> = {
  value: TData
  meta: FieldMeta
}

export class FieldApi<TData, TFormData> {
  uid: number
  form: FormApi<TFormData>
  name!: DeepKeys<TFormData>
  store!: Store<FieldState<TData>>
  state!: FieldState<TData>
  options: RequiredByKey<FieldOptions<TData, TFormData>, 'validateOn'> =
    {} as any

  constructor(opts: FieldApiOptions<TData, TFormData>) {
    this.form = opts.form
    this.uid = uid++
    // Support field prefixing from FieldScope
    let fieldPrefix = ''
    if (this.form.fieldName) {
      fieldPrefix = `${this.form.fieldName}.`
    }

    this.name = (fieldPrefix + opts.name) as any

    this.store = new Store<FieldState<TData>>(
      {
        value: this.getValue(),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        meta: this.getMeta() ?? {
          isValidating: false,
          isTouched: false,
          ...this.options.defaultMeta,
        },
      },
      {
        onUpdate: (next) => {
          next.meta.touchedError = next.meta.isTouched
            ? next.meta.error
            : undefined

          // Do not validate pristine fields
          if (!this.options.validatePristine && !next.meta.isTouched) return

          // If validateOn is set to a variation of change, run the validation
          if (
            this.options.validateOn === 'change' ||
            this.options.validateOn.split('-')[0] === 'change'
          ) {
            try {
              this.validate()
            } catch (err) {
              console.error('An error occurred during validation', err)
            }
          }

          this.state = next
        },
      },
    )

    this.state = this.store.state
    this.update(opts)
  }

  mount = () => {
    const info = this.getInfo()
    info.instances[this.uid] = this

    const unsubscribe = this.form.store.subscribe(() => {
      this.updateStore()
    })

    return () => {
      unsubscribe()
      delete info.instances[this.uid]
      if (!Object.keys(info.instances).length) {
        delete this.form.fieldInfo[this.name]
      }
    }
  }

  updateStore = () => {
    this.store.batch(() => {
      const nextValue = this.getValue()
      const nextMeta = this.getMeta()

      if (nextValue !== this.state.value) {
        this.store.setState((prev) => ({ ...prev, value: nextValue }))
      }

      if (nextMeta !== this.state.meta) {
        this.store.setState((prev) => ({ ...prev, meta: nextMeta }))
      }
    })
  }

  update = (opts: FieldApiOptions<TData, TFormData>) => {
    this.options = { validateOn: 'blur', ...opts }

    // Default Value
    if (
      this.state.value === undefined &&
      this.options.defaultValue !== undefined
    ) {
      this.setValue(this.options.defaultValue)
    }

    // Default Meta
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.getMeta() === undefined) {
      this.setMeta(this.state.meta)
    }
  }

  getValue = (): TData => this.form.getFieldValue(this.name)
  setValue = (
    updater: Updater<TData>,
    options?: { touch?: boolean; notify?: boolean },
  ) => this.form.setFieldValue(this.name, updater as any, options)

  getMeta = (): FieldMeta => this.form.getFieldMeta(this.name)
  setMeta = (updater: Updater<FieldMeta>) =>
    this.form.setFieldMeta(this.name, updater)

  getInfo = () => this.form.getFieldInfo(this.name)

  pushValue = (value: TData) =>
    this.form.pushFieldValue(this.name, value as any)
  insertValue = (index: number, value: TData) =>
    this.form.insertFieldValue(this.name, index, value as any)
  removeValue = (index: number) => this.form.spliceFieldValue(this.name, index)
  swapValues = (aIndex: number, bIndex: number) =>
    this.form.swapFieldValues(this.name, aIndex, bIndex)

  getSubField = <TName extends DeepKeys<TData>>(name: TName) =>
    new FieldApi<DeepValue<TData, TName>, TFormData>({
      name: `${this.name}.${name}` as any,
      form: this.form,
    })

  validate = async () => {
    if (!this.options.validate) {
      return
    }

    this.setMeta((prev) => ({ ...prev, isValidating: true }))

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationCount = (this.getInfo().validationCount || 0) + 1

    this.getInfo().validationCount = validationCount

    const checkLatest = () => validationCount === this.getInfo().validationCount

    if (!this.getInfo().validationPromise) {
      this.getInfo().validationPromise = new Promise((resolve, reject) => {
        this.getInfo().validationResolve = resolve
        this.getInfo().validationReject = reject
      })
    }

    try {
      const rawError = await this.options.validate(this.state.value, this)

      if (checkLatest()) {
        const error = (() => {
          if (rawError) {
            if (typeof rawError !== 'string') {
              return 'Invalid Form Values'
            }

            return null
          }

          return undefined
        })()

        this.setMeta((prev) => ({
          ...prev,
          isValidating: false,
          error,
        }))
        this.getInfo().validationResolve?.(error)
      }
    } catch (error) {
      if (checkLatest()) {
        this.getInfo().validationReject?.(error)
        throw error
      }
    } finally {
      if (checkLatest()) {
        this.setMeta((prev) => ({ ...prev, isValidating: false }))
        delete this.getInfo().validationPromise
      }
    }

    return this.getInfo().validationPromise
  }

  getChangeProps = <T extends ChangeProps<any>>(
    props: T = {} as T,
  ): ChangeProps<TData> & Omit<T, keyof ChangeProps<TData>> => {
    return {
      ...props,
      value: this.state.value,
      onChange: (value) => {
        this.setValue(value)
        props.onChange(value)
      },
      onBlur: (e) => {
        this.setMeta((prev) => ({ ...prev, isTouched: true }))

        const { validateOn } = this.options

        if (validateOn === 'blur' || validateOn.split('-')[0] === 'blur') {
          this.validate()
        }

        props.onBlur(e)
      },
    } as ChangeProps<TData> & Omit<T, keyof ChangeProps<TData>>
  }

  getInputProps = <T extends InputProps>(
    props: T = {} as T,
  ): InputProps & Omit<T, keyof InputProps> => {
    return {
      ...props,
      value: String(this.state.value),
      onChange: (e) => {
        this.setValue(e.target.value)
        props.onChange(e.target.value)
      },
      onBlur: this.getChangeProps(props).onBlur,
    }
  }
}
