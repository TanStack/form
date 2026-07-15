import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { FieldListMetaBadges } from '../src/components/fields/leftPanel/FieldListMetaBadges'
import {
  FormDevtoolsStoreProvider,
  useFormDevtoolsStore,
} from '../src/stores/formDevtoolsStore'
import { fieldListCache } from '../src/stores/fieldListStore'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { FieldId, FormId } from '../src/types/branded'

const formId = 'form-a' as FormId
const fieldId = 'field-a' as FieldId
const disposers: Array<() => void> = []

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  fieldListCache.setSubscribedFormId(null)
  fieldListCache.clearRows()
})

function StoreCapture(props: { onStore: (store: FormDevtoolsStore) => void }) {
  props.onStore(useFormDevtoolsStore())
  return null
}

describe('field list meta badges', () => {
  it('renders active non-default summary badges', () => {
    disposers.push(connectTestEventBus())
    const container = document.createElement('div')
    let store!: FormDevtoolsStore
    disposers.push(
      render(
        () => (
          <FormDevtoolsStoreProvider>
            <StoreCapture onStore={(value) => (store = value)} />
            <FieldListMetaBadges fieldId={fieldId} />
          </FormDevtoolsStoreProvider>
        ),
        container,
      ),
    )
    store.fieldList.setSubscribedFormId(formId)
    store.fieldList.applySnapshot({
      formInstanceId: formId,
      fields: [
        {
          fieldId,
          path: 'name',
          summary: {
            isTouched: true,
            isBlurred: true,
            isLongValidating: true,
            isDefaultValue: false,
            validity: 'invalidHidden',
          },
        },
      ],
    })

    expect(container.textContent).not.toContain('Touched')
    expect(container.textContent).toContain('Blurred')
    expect(container.textContent).toContain('Validating')
    expect(container.textContent).toContain('Invalid (hidden)')
    expect(container.textContent).toContain('Non-default value')
    expect(container.textContent).not.toContain('Dirty')

    store.fieldList.applyPatch({
      formInstanceId: formId,
      upsert: [{ fieldId, setSummary: { validity: 'invalid' } }],
    })

    expect(container.textContent).toContain('Invalid')
    expect(container.textContent).toContain('Validating')
    expect(container.textContent).not.toContain('Invalid (hidden)')

    store.fieldList.applyPatch({
      formInstanceId: formId,
      upsert: [
        {
          fieldId,
          clearSummary: [
            'isTouched',
            'isBlurred',
            'isLongValidating',
            'isDefaultValue',
            'validity',
          ],
        },
      ],
    })

    expect(container.textContent).not.toContain('Touched')
    expect(container.textContent).not.toContain('Blurred')
    expect(container.textContent).not.toContain('Validating')
    expect(container.textContent).not.toContain('Invalid')
    expect(container.textContent).not.toContain('Non-default value')
  })
})
