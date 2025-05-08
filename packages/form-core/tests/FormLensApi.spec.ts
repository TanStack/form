import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi, FormLensApi } from '../src/index'
import { sleep } from './utils'
import type { AnyFieldApi, AnyFormApi } from '../src/index'

describe('form lens api', () => {
  type Person = {
    name: string
    age: number
  }
  type FormValues = {
    people: Person[]
    name: string
    age: number
    relatives: {
      father: Person
    }
  }

  it('should inherit defaultValues from the form', () => {
    const defaultValues: FormValues = {
      name: 'Do not access',
      age: -1,
      people: [
        {
          name: 'Lens one',
          age: 1,
        },
        {
          name: 'Lens two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'Lens three',
          age: 3,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const lens1 = new FormLensApi({
      form,
      name: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FormLensApi({
      form,
      name: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FormLensApi({
      form,
      name: 'relatives.father',
      defaultValues: {} as Person,
    })

    expect(lens1.state).toMatchObject({
      values: {
        name: 'Lens one',
        age: 1,
      },
    })
    expect(lens2.state).toMatchObject({
      values: {
        name: 'Lens two',
        age: 2,
      },
    })
    expect(lens3.state).toMatchObject({
      values: {
        name: 'Lens three',
        age: 3,
      },
    })
  })

  it('should inherit the name from the constructor', () => {
    const defaultValues: FormValues = {
      name: 'Do not access',
      age: -1,
      people: [],
      relatives: {
        father: {
          name: 'father',
          age: 10,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const lens = new FormLensApi({
      form,
      defaultValues: {} as Person,
      name: 'relatives.father',
    })

    expect(lens.name).toEqual('relatives.father')
  })

  it("should expose the form's base properties", () => {
    const defaultValues: FormValues = {
      name: 'Do not access',
      age: -1,
      people: [],
      relatives: {
        father: {
          name: 'father',
          age: 10,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const lens = new FormLensApi({
      form,
      defaultValues: {} as Person,
      name: 'relatives.father',
    })

    expect(lens.baseStore).toStrictEqual(form.baseStore)
    expect(lens.options).toStrictEqual(form.options)
    expect(lens.store).toStrictEqual(form.store)
    expect(lens.fieldMetaDerived).toStrictEqual(form.fieldMetaDerived)
  })

  it('should have the state synced with the form', () => {
    const defaultValues: FormValues = {
      name: 'Do not access',
      age: -1,
      people: [],
      relatives: {
        father: {
          name: 'father',
          age: 10,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const lens = new FormLensApi({
      form,
      defaultValues: {} as Person,
      name: 'relatives.father',
    })

    function checkIfStateIsSynced() {
      const { values: formValues, ...formState } = form.state
      const { values: lensValues, ...lensState } = lens.state

      expect(lensValues).toEqual(formValues.relatives.father)
      expect(formState).toEqual(lensState)
    }

    checkIfStateIsSynced()

    form.setFieldValue('relatives.father.name', 'New name')
    form.setFieldValue('relatives.father.age', 50)

    checkIfStateIsSynced()

    lens.setFieldValue('name', 'Second new name')
    lens.setFieldValue('age', 100)

    checkIfStateIsSynced()
    lens.reset()

    checkIfStateIsSynced()
  })
})
