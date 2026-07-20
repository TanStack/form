import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it, vi } from 'vitest'
import {
  formDevtoolsBridgeRuntimeKey,
  getOrCreateFormDevtoolsBridgeRuntime,
} from '../src/bridge/runtime'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type {
  DevtoolsFieldDetail,
  FormDevtoolsBridgeStatusResponse,
  FormDevtoolsEventMap,
} from '../src/eventClientTypes'

const flushFieldPatches = () => Promise.resolve()

describe('form devtools bridge runtime', () => {
  it('creates only one runtime for each host', () => {
    const host = {}
    const firstRuntime = { dispose: vi.fn() }
    const createFirstRuntime = vi.fn(() => firstRuntime)
    const createReplacementRuntime = vi.fn(() => ({ dispose: vi.fn() }))

    expect(
      getOrCreateFormDevtoolsBridgeRuntime({
        host,
        createRuntime: createFirstRuntime,
      }),
    ).toBe(firstRuntime)
    expect(
      getOrCreateFormDevtoolsBridgeRuntime({
        host,
        createRuntime: createReplacementRuntime,
      }),
    ).toBe(firstRuntime)
    expect(createFirstRuntime).toHaveBeenCalledOnce()
    expect(createReplacementRuntime).not.toHaveBeenCalled()
    expect(firstRuntime.dispose).not.toHaveBeenCalled()
  })

  it('keeps mounted forms and field subscriptions across re-evaluation', async () => {
    const disconnectEventBus = connectTestEventBus()
    const host = {}
    const runtime = getOrCreateFormDevtoolsBridgeRuntime({ host })
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregisterField = field._register()
    const mountedForms: Array<FormDevtoolsEventMap['mounted-forms-changed']> =
      []
    const snapshots: Array<FormDevtoolsEventMap['field-list-snapshot']> = []
    const patches: Array<FormDevtoolsEventMap['field-list-patch']> = []
    const details: Array<DevtoolsFieldDetail> = []
    const statuses: Array<FormDevtoolsBridgeStatusResponse> = []
    const cleanupMountedForms = formDevtoolsEventClient.on(
      'mounted-forms-changed',
      (event) => mountedForms.push(event.payload),
    )
    const cleanupSnapshots = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => snapshots.push(event.payload),
    )
    const cleanupPatches = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )
    const cleanupStatuses = formDevtoolsEventClient.on(
      'bridge-status-response',
      (event) => statuses.push(event.payload),
    )
    const unmountForm = form.mount()

    try {
      const formInstanceId = mountedForms.at(-1)!.forms[0]!.instanceId
      formDevtoolsEventClient.emit('field-list-subscribe', {
        formInstanceId,
      })
      const fieldId = snapshots.at(-1)!.fields[0]!.fieldId
      formDevtoolsEventClient.emit('field-detail-subscribe', {
        formInstanceId,
        fieldId,
        settings: {
          includeValues: true,
          errorPayloadMode: 'full',
          debounceMs: 0,
        },
      })
      formDevtoolsEventClient.emit('bridge-status-request', {
        requestId: 'before-re-evaluation',
      })

      expect(statuses.at(-1)).toMatchObject({
        requestId: 'before-re-evaluation',
        mountedFormCount: 1,
      })
      const bridgeInstanceId = statuses.at(-1)!.bridgeInstanceId

      field.handleChange('Ada')
      await flushFieldPatches()
      expect(patches).toHaveLength(1)
      expect(details.at(-1)?.state.value).toBe('Ada')

      const createReplacementRuntime = vi.fn(() => ({ dispose: vi.fn() }))
      expect(
        getOrCreateFormDevtoolsBridgeRuntime({
          host,
          createRuntime: createReplacementRuntime,
        }),
      ).toBe(runtime)
      expect(createReplacementRuntime).not.toHaveBeenCalled()

      field._setMeta((meta) => ({ ...meta, isBlurred: true }))
      await flushFieldPatches()
      expect(patches).toHaveLength(2)
      expect(patches.at(-1)?.upsert?.[0]?.setSummary).toEqual({
        isBlurred: true,
      })

      field.handleChange('Grace')
      expect(details.at(-1)?.state.value).toBe('Grace')

      formDevtoolsEventClient.emit('bridge-status-request', {
        requestId: 'after-re-evaluation',
      })
      expect(statuses.at(-1)).toEqual({
        requestId: 'after-re-evaluation',
        bridgeInstanceId,
        mountedFormCount: 1,
      })
    } finally {
      cleanupStatuses()
      cleanupDetails()
      cleanupPatches()
      cleanupSnapshots()
      cleanupMountedForms()
      unmountForm()
      unregisterField()
      runtime.dispose()
      disconnectEventBus()
    }

    expect(
      (host as { [key: symbol]: unknown })[formDevtoolsBridgeRuntimeKey],
    ).toBeUndefined()
  })
})
