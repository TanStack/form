import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { FieldListMetaBadges } from '../src/components/fields/FieldListMetaBadges'
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
  it('renders touched only while the sparse summary is touched', () => {
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
      fields: [{ fieldId, path: 'name', summary: { isTouched: true } }],
    })

    expect(container.textContent).toContain('Touched')
    expect(container.textContent).not.toContain('Dirty')

    store.fieldList.applyPatch({
      formInstanceId: formId,
      upsert: [{ fieldId, clearSummary: ['isTouched'] }],
    })

    expect(container.textContent).not.toContain('Touched')
  })
})
