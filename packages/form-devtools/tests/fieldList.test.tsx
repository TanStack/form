import { render } from 'solid-js/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FieldList } from '../src/components/fields/leftPanel/FieldList'
import {
  FormDevtoolsStoreProvider,
  useFormDevtoolsStore,
} from '../src/stores/formDevtoolsStore'
import { formSelectorCache } from '../src/stores/formSelectorStore'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'

const disposers: Array<() => void> = []
const containers: Array<HTMLElement> = []

beforeEach(() => {
  disposers.push(connectTestEventBus())
})

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  for (const container of containers.splice(0)) container.remove()
  formSelectorCache.setMountedForms([])
  formSelectorCache.setRequestedFormId(null)
})

function FieldListHarness(props: {
  capture: (store: FormDevtoolsStore) => void
}) {
  const store = useFormDevtoolsStore()
  props.capture(store)
  return <FieldList />
}

describe('FieldList', () => {
  it('starts without a selection and clears it when the selected row is clicked', async () => {
    formSelectorCache.setMountedForms([
      { instanceId: 'form-a', label: 'Form A' },
    ])

    const container = document.createElement('div')
    document.body.append(container)
    containers.push(container)
    let store!: FormDevtoolsStore
    const dispose = render(
      () => (
        <FormDevtoolsStoreProvider>
          <FieldListHarness capture={(value) => (store = value)} />
        </FormDevtoolsStoreProvider>
      ),
      container,
    )
    disposers.push(dispose)

    store.fieldList.applySnapshot({
      formInstanceId: 'form-a',
      fields: [{ fieldId: 'field-name', path: 'user.name' }],
    })

    const row = container.querySelector<HTMLElement>('[role="option"]')
    expect(row).not.toBeNull()
    expect(store.fieldList.selectedFieldPath()).toBeNull()
    expect(row?.getAttribute('aria-selected')).toBe('false')

    row?.click()
    await Promise.resolve()
    expect(store.fieldList.selectedFieldPath()).toBe('user.name')
    expect(row?.getAttribute('aria-selected')).toBe('true')

    row?.click()
    await Promise.resolve()
    expect(store.fieldList.selectedFieldPath()).toBeNull()
    expect(row?.getAttribute('aria-selected')).toBe('false')
  })
})
