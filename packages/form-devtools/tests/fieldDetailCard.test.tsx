import { Show } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { FieldDetailCard } from '../src/components/fields/fieldDetails/FieldDetailCard'
import {
  FormDevtoolsStoreProvider,
  useFormDevtoolsStore,
} from '../src/stores/formDevtoolsStore'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { DevtoolsFieldDetail } from '../src/eventClientTypes'
import type { FormId } from '../src/types/branded'

const disposers: Array<() => void> = []

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
})

function CardHarness(props: { capture: (store: FormDevtoolsStore) => void }) {
  const store = useFormDevtoolsStore()
  props.capture(store)

  return (
    <Show when={store.fieldList.selectedFieldRow()}>
      {(field) => <FieldDetailCard field={field()} />}
    </Show>
  )
}

describe('FieldDetailCard', () => {
  it('renders subscribed details while sourcing badges from field meta', () => {
    const disconnectEventBus = connectTestEventBus()
    const container = document.createElement('div')
    let store!: FormDevtoolsStore
    const dispose = render(
      () => (
        <FormDevtoolsStoreProvider>
          <CardHarness capture={(value) => (store = value)} />
        </FormDevtoolsStoreProvider>
      ),
      container,
    )
    disposers.push(dispose, disconnectEventBus)

    const formInstanceId = 'form-a' as FormId
    store.fieldList.setSubscribedFormId(formInstanceId)
    store.fieldList.applySnapshot({
      formInstanceId,
      fields: [
        {
          fieldId: 'field-name',
          path: 'user.name',
          summary: { validity: 'invalidHidden' },
        },
      ],
    })
    store.fieldList.setSelectedFieldPath('user.name')

    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull()

    const detail = {
      formInstanceId,
      fieldId: 'field-name',
      settings: store.fieldDetails.getFieldDetailSettings('field-name'),
      state: {
        value: 'Grace',
        meta: {
          isTouched: true,
          isDirty: true,
          isPristine: false,
          isDefaultValue: false,
          isBlurred: false,
          isValidating: false,
          isSelfTouched: true,
          isSelfDirty: true,
          isSelfValidating: false,
          isSelfValid: true,
          isValid: true,
          isInvalid: false,
          subfields: {
            isEveryValid: true,
            isAnyInvalid: false,
            isEveryPristine: true,
            isSomeDirty: false,
            isSomeTouched: false,
            isSomeValidating: false,
          },
          errors: [],
          original: {
            errors: [
              {
                error: { message: 'First hidden error' },
                source: {
                  scope: 'field',
                  validatorIndex: 0,
                  validatorType: 'callback',
                },
                sourceEvent: 'change',
              },
              {
                error: { message: 'Second hidden error' },
                source: {
                  scope: 'field',
                  validatorIndex: 0,
                  validatorType: 'callback',
                },
                sourceEvent: 'change',
              },
            ],
            isValid: false,
            isInvalid: true,
          },
        },
      },
      defaultValue: 'Ada',
    } satisfies DevtoolsFieldDetail

    store.fieldDetails.applyDetail(detail)

    expect(container.querySelector('[data-slot="skeleton"]')).toBeNull()
    expect(container.textContent).toContain('Grace')
    expect(container.textContent).toContain('Ada')
    expect(container.textContent).toContain('Invalid (hidden)')
    expect(
      Array.from(container.querySelectorAll('[data-slot="item-title"]')).map(
        (element) => element.textContent,
      ),
    ).toEqual(['First hidden error', 'Second hidden error'])
    expect(
      Array.from(
        container.querySelectorAll('[data-slot="item-description"]'),
      ).map((description) =>
        Array.from(description.querySelectorAll('span')).map(
          (label) => label.textContent,
        ),
      ),
    ).toEqual([
      ['Field', 'Callback', 'change'],
      ['Field', 'Callback', 'change'],
    ])
    expect(container.textContent).toContain('Pristine')
    expect(container.textContent).not.toContain('Dirty')
    expect(store.fieldDetails.getFieldDetail('field-name')?.state.meta).toEqual(
      detail.state.meta,
    )

    store.fieldList.applyPatch({
      formInstanceId,
      upsert: [
        {
          fieldId: 'field-name',
          setSummary: {
            isDirty: true,
            isTouched: true,
            isDefaultValue: false,
            validity: 'valid',
          },
        },
      ],
    })

    expect(container.textContent).toContain('Valid')
    expect(container.textContent).toContain('Dirty')
    expect(container.textContent).toContain('Touched')
    expect(container.textContent).toContain('Non-default value')
    expect(container.textContent).not.toContain('Invalid (hidden)')
  })
})
