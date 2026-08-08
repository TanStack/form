import { describe, expect, it } from 'vitest'
import {
  InternalFieldGroupApi,
  defineFieldGroupFieldsRuntime,
  fieldGroupHelperRuntime,
} from '../../src/FieldGroup/FieldGroupApi.lib'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

function mergeWithDescriptors<TProps extends object>(
  props: TProps,
  overrides: Partial<TProps>,
): TProps {
  return Object.defineProperties(
    Object.defineProperties({}, Object.getOwnPropertyDescriptors(props)),
    Object.getOwnPropertyDescriptors(overrides),
  ) as TProps
}

describe('InternalFieldGroupApi', () => {
  it('resolves logical names, follows binding changes, and exposes values', () => {
    const form = new InternalFormApi({
      defaultValues: {
        first: { name: 'Tony' },
        second: { name: 'Rodney' },
      },
    })
    let bindings = { profile: 'first' }
    const group = new InternalFieldGroupApi({
      form,
      fieldNames: ['profile.name'],
      getBindings: () => bindings,
    })

    expect(group.getFieldValue('profile.name')).toBe('Tony')
    expect(group.atom.get()).toEqual({ 'profile.name': 'Tony' })

    group.setFieldValue('profile.name', 'Updated')
    expect(form.getFieldValue('first.name')).toBe('Updated')
    expect(group.atom.get()).toEqual({ 'profile.name': 'Updated' })

    group.resetField('profile.name')
    expect(group.getFieldValue('profile.name')).toBe('Tony')

    bindings = { profile: 'second' }
    expect(group.getFieldValue('profile.name')).toBe('Rodney')
  })

  it('throws when a logical field has no binding', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const group = new InternalFieldGroupApi({
      form,
      fieldNames: ['missing'],
      getBindings: () => ({}),
    })

    expect(() => group.getFieldValue('missing')).toThrow(
      'TanStack Form: Missing field group binding for "missing".',
    )
  })

  it('keeps transformed field option overrides lazy', () => {
    const form = new InternalFormApi({
      defaultValues: {
        account: {
          confirmation: '',
          backup: '',
          password: '',
          email: '',
        },
      },
    })
    const bindings = {
      confirmation: 'account.confirmation',
      backup: 'account.backup',
      password: 'account.password',
      email: 'account.email',
    }
    const group = new InternalFieldGroupApi({
      form,
      fieldNames: ['confirmation'],
      getBindings: () => bindings,
    })
    let fieldName = 'confirmation'
    let watchedFieldName = 'password'
    const props = {
      get name() {
        return fieldName
      },
      get validators() {
        return [{ watchFields: [watchedFieldName] }]
      },
      get listeners() {
        return [{ watchFields: [watchedFieldName] }]
      },
    }

    const options = group._getFormFieldOptions(
      props as never,
      mergeWithDescriptors,
    )

    expect(options.name).toBe('account.confirmation')
    expect(options.validators?.[0]?.watchFields).toEqual(['account.password'])
    expect(options.listeners?.[0]?.watchFields).toEqual(['account.password'])

    fieldName = 'backup'
    watchedFieldName = 'email'

    expect(options.name).toBe('account.backup')
    expect(options.validators?.[0]?.watchFields).toEqual(['account.email'])
    expect(options.listeners?.[0]?.watchFields).toEqual(['account.email'])
  })

  it('forwards every array method through the current binding', () => {
    const form = new InternalFormApi({
      defaultValues: { lists: { primary: ['a', 'b', 'c'] } },
    })
    const group = new InternalFieldGroupApi({
      form,
      fieldNames: ['items'],
      getBindings: () => ({ items: 'lists.primary' }),
    })

    group.swapFieldValues('items', 0, 2)
    expect(group.getFieldValue('items')).toEqual(['c', 'b', 'a'])

    group.moveFieldValue('items', 2, 0)
    expect(group.getFieldValue('items')).toEqual(['a', 'c', 'b'])

    group.pushFieldValue('items', 'd')
    group.insertFieldValue('items', 1, 'x')
    group.removeFieldValue('items', 2)
    group.filterFieldValues('items', (value) => value !== 'x')
    expect(group.getFieldValue('items')).toEqual(['a', 'b', 'd'])

    group.clearFieldValues('items')
    expect(group.getFieldValue('items')).toEqual([])
  })

  it('shares the runtime implementations behind typed field definitions', () => {
    const fields = { name: fieldGroupHelperRuntime.strict() }

    expect(fieldGroupHelperRuntime.loose()).toBeNull()
    expect(defineFieldGroupFieldsRuntime(fields)).toBe(fields)
  })
})
