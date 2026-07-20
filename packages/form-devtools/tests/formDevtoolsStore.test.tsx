import { render } from 'solid-js/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  FormDevtoolsStoreProvider,
  useFormDevtoolsStore,
} from '../src/stores/formDevtoolsStore'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { formSelectorCache } from '../src/stores/formSelectorStore'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'

const disposers: Array<() => void> = []

beforeEach(() => {
  disposers.push(connectTestEventBus())
})

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  formSelectorCache.setMountedForms([])
  formSelectorCache.setRequestedFormId(null)
  formSelectorCache.setBridgeStatus('checking')
  formSelectorCache.setBridgeInstanceId(null)
  formSelectorCache.setBridgeMountedFormCount(null)
})

function StoreCapture(props: { onStore: (store: FormDevtoolsStore) => void }) {
  const store = useFormDevtoolsStore()
  props.onStore(store)
  return null
}

function renderStore(onStore: (store: FormDevtoolsStore) => void) {
  const disposeRoot = render(
    () => (
      <FormDevtoolsStoreProvider>
        <StoreCapture onStore={onStore} />
      </FormDevtoolsStoreProvider>
    ),
    document.createElement('div'),
  )
  let isDisposed = false
  const dispose = () => {
    if (isDisposed) return
    isDisposed = true
    disposeRoot()
  }

  disposers.push(dispose)
  return dispose
}

describe('form devtools store provider', () => {
  it('shares its cache while owning computations per store instance', () => {
    let first!: FormDevtoolsStore
    let second!: FormDevtoolsStore

    renderStore((store) => (first = store))
    renderStore((store) => (second = store))

    first.formSelector.setMountedForms([
      { instanceId: 'form-a', label: 'Form A' },
    ])

    expect(first.formSelector.mountedForms).toBe(
      second.formSelector.mountedForms,
    )
    expect(first.formSelector.selectedForm).not.toBe(
      second.formSelector.selectedForm,
    )
    expect(first.fieldList.rowsByPath).toBe(second.fieldList.rowsByPath)
    expect(first.fieldList.fieldRows).not.toBe(second.fieldList.fieldRows)
    expect(first.formSelector.selectedForm()?.label).toBe('Form A')
    expect(second.formSelector.selectedForm()?.label).toBe('Form A')
  })

  it('retains the shared field subscription until the last instance releases it', () => {
    let subscribeCount = 0
    let unsubscribeCount = 0

    formSelectorCache.setMountedForms([
      { instanceId: 'form-a', label: 'Form A' },
    ])
    const cleanupSubscribe = formDevtoolsEventClient.on(
      'field-list-subscribe',
      () => subscribeCount++,
    )
    const cleanupUnsubscribe = formDevtoolsEventClient.on(
      'field-list-unsubscribe',
      () => unsubscribeCount++,
    )
    disposers.push(cleanupSubscribe, cleanupUnsubscribe)
    const disposeFirst = renderStore(() => {})
    const disposeSecond = renderStore(() => {})

    expect(subscribeCount).toBe(1)

    disposeFirst()
    expect(unsubscribeCount).toBe(0)

    disposeSecond()
    expect(unsubscribeCount).toBe(1)
  })

  it('retains shared field-detail subscriptions until the last instance releases them', () => {
    let subscribeCount = 0
    let unsubscribeCount = 0
    let first!: FormDevtoolsStore
    let second!: FormDevtoolsStore

    formSelectorCache.setMountedForms([
      { instanceId: 'form-a', label: 'Form A' },
    ])
    const cleanupSubscribe = formDevtoolsEventClient.on(
      'field-detail-subscribe',
      () => subscribeCount++,
    )
    const cleanupUnsubscribe = formDevtoolsEventClient.on(
      'field-detail-unsubscribe',
      () => unsubscribeCount++,
    )
    disposers.push(cleanupSubscribe, cleanupUnsubscribe)
    const disposeFirst = renderStore((store) => (first = store))
    const disposeSecond = renderStore((store) => (second = store))

    first.fieldList.applySnapshot({
      formInstanceId: 'form-a',
      fields: [{ fieldId: 'field-name', path: 'name' }],
    })
    first.fieldList.setSelectedFieldPath('name')

    expect(first.fieldList.mainPanelFieldRows()).toHaveLength(1)
    expect(second.fieldList.mainPanelFieldRows()).toHaveLength(1)
    expect(subscribeCount).toBe(1)

    disposeFirst()
    expect(unsubscribeCount).toBe(0)

    disposeSecond()
    expect(unsubscribeCount).toBe(1)
  })
})
