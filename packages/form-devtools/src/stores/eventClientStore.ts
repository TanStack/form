import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { devtools } from '@tanstack/form-core/internals'
import { createFormDevtoolsBridge } from '../devtoolsBridge.lib'
import { emitFormEvent, onFormEvent } from '../eventClient.lib'
import { upsertFieldDetail } from './fieldDetailsStore'
import { upsertMountedField } from './mountedFieldsStore'
import { getDevtoolsFormKey, parseDevtoolsFormKey } from './eventClientTypes'
import type {
  BroadcastFieldDetailSubscribeRequest,
  BroadcastFieldDetailUnsubscribeRequest,
} from '../eventClientTypes'
import type { DevtoolsFormState } from './eventClientTypes'

export function createFormEventClientStore() {
  const [store, setStore] = createSignal<Array<DevtoolsFormState>>([])
  const [activeFormKey, setActiveFormKey] = createSignal<string | null>(null)
  let fieldIdIndex = 0
  const createFieldId = () => String(++fieldIdIndex)

  const findFormIndex = (
    forms: Array<DevtoolsFormState>,
    form: Pick<DevtoolsFormState, 'id' | 'instanceId'>,
  ) => {
    const formKey = getDevtoolsFormKey(form)

    return forms.findIndex((item) => getDevtoolsFormKey(item) === formKey)
  }

  const requestFieldDetailSubscribe = (
    payload: BroadcastFieldDetailSubscribeRequest,
  ) => {
    emitFormEvent('subscribe-field-detail', payload)
  }

  const requestFieldDetailUnsubscribe = (
    payload: BroadcastFieldDetailUnsubscribeRequest,
  ) => {
    emitFormEvent('unsubscribe-field-detail', payload)
  }

  const selectForm = (formKey: string | null) => {
    if (
      formKey === null ||
      store().some((item) => getDevtoolsFormKey(item) === formKey)
    ) {
      setActiveFormKey(formKey)
    }
  }

  const activeForm = createMemo(() => {
    const formKey = activeFormKey()
    if (formKey === null) return undefined

    return store().find((item) => getDevtoolsFormKey(item) === formKey)
  })

  onMount(() => {
    const unsubRegistered = onFormEvent('form-registered', (e) => {
      const formKey = getDevtoolsFormKey(e.payload)
      const existing = store().some(
        (item) => getDevtoolsFormKey(item) === formKey,
      )

      if (!existing) {
        setStore((forms) => [
          ...forms,
          {
            id: e.payload.id,
            instanceId: e.payload.instanceId,
            mountedFields: [],
            fieldDetails: [],
          },
        ])
      }

      if (activeFormKey() === null) {
        setActiveFormKey(formKey)
      }
    })

    const unsubUnregistered = onFormEvent('form-unregistered', (e) => {
      const formKey = getDevtoolsFormKey(e.payload)
      const remainingForms = store().filter(
        (item) => getDevtoolsFormKey(item) !== formKey,
      )

      setStore(remainingForms)

      if (activeFormKey() === formKey) {
        setActiveFormKey(
          remainingForms[0] ? getDevtoolsFormKey(remainingForms[0]) : null,
        )
      }
    })

    const unsubFieldListState = onFormEvent('field-list-state', (e) => {
      setStore((forms) => {
        const existingIndex = findFormIndex(forms, e.payload)
        if (existingIndex === -1) return forms

        const existing = forms[existingIndex]!
        const currentPaths = new Set(e.payload.fields.map((field) => field.path))
        const mountedFields = e.payload.fields.reduce(
          (next, field) => upsertMountedField(next, field, createFieldId),
          existing.mountedFields.filter((field) =>
            currentPaths.has(field.path),
          ),
        )
        const fieldDetails = existing.fieldDetails.filter((fieldDetail) =>
          currentPaths.has(fieldDetail.path),
        )
        const nextForms = forms.slice()
        nextForms[existingIndex] = {
          ...existing,
          mountedFields,
          fieldDetails,
        }
        return nextForms
      })
    })

    const unsubFieldDetailState = onFormEvent('field-detail-state', (e) => {
      setStore((forms) => {
        const existingIndex = findFormIndex(forms, e.payload)
        if (existingIndex === -1) return forms

        const existing = forms[existingIndex]!
        const nextForms = forms.slice()
        nextForms[existingIndex] = {
          ...existing,
          fieldDetails: upsertFieldDetail(existing.fieldDetails, e.payload),
        }
        return nextForms
      })
    })

    const uninstallBridge = devtools.installBridge(createFormDevtoolsBridge())

    emitFormEvent('subscribe-form-registry', {})

    onCleanup(() => {
      uninstallBridge()
      unsubRegistered()
      unsubFieldListState()
      unsubFieldDetailState()
      unsubUnregistered()

      for (const form of store()) {
        for (const fieldDetail of form.fieldDetails) {
          requestFieldDetailUnsubscribe({
            id: fieldDetail.id,
            instanceId: fieldDetail.instanceId,
            path: fieldDetail.path,
          })
        }
      }
    })
  })

  createEffect(() => {
    const formKey = activeFormKey()
    if (!formKey) return
    const { id, instanceId } = parseDevtoolsFormKey(formKey)

    const payload = {
      id,
      instanceId,
    }

    emitFormEvent('subscribe-field-list', payload)
    onCleanup(() => {
      emitFormEvent('unsubscribe-field-list', payload)
    })
  })

  return {
    activeForm,
    activeFormKey,
    requestFieldDetailSubscribe,
    requestFieldDetailUnsubscribe,
    selectForm,
    store,
  }
}
