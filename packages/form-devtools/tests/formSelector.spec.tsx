import { render } from 'solid-js/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../src'
import { InternalFormApi } from '@tanstack/form-core/internals'
import { FormSelector } from '../src/components/FormSelector'
import {
  FormSelectorProvider,
  useFormSelector,
} from '../src/contexts/formSelectorContext'
import type { FormSelectorContextValue } from '../src/contexts/formSelectorContext'
import type { JSX } from 'solid-js'

interface EventClientDispatchEvent {
  type: string
  payload: unknown
  pluginId?: string
}

let disposeEventClientBus: (() => void) | undefined

function installEventClientBus() {
  const onConnect = () => {
    window.dispatchEvent(new CustomEvent('tanstack-connect-success'))
  }
  const onDispatch = (event: Event) => {
    const devtoolsEvent = (event as CustomEvent<EventClientDispatchEvent>)
      .detail

    window.dispatchEvent(
      new CustomEvent(devtoolsEvent.type, { detail: devtoolsEvent }),
    )
    window.dispatchEvent(
      new CustomEvent('tanstack-devtools-global', {
        detail: devtoolsEvent,
      }),
    )
  }

  window.addEventListener('tanstack-connect', onConnect)
  window.addEventListener('tanstack-dispatch-event', onDispatch)

  return () => {
    window.removeEventListener('tanstack-connect', onConnect)
    window.removeEventListener('tanstack-dispatch-event', onDispatch)
  }
}

function CaptureSelector(props: {
  onSelector: (selector: FormSelectorContextValue) => void
}) {
  props.onSelector(useFormSelector())
  return null
}

function renderFormSelector(children?: () => JSX.Element) {
  let selector: FormSelectorContextValue | undefined
  const container = document.createElement('div')
  document.body.append(container)
  const dispose = render(
    () => (
      <FormSelectorProvider>
        <CaptureSelector
          onSelector={(nextSelector) => {
            selector = nextSelector
          }}
        />
        {children?.()}
      </FormSelectorProvider>
    ),
    container,
  )

  return {
    container,
    selector: () => {
      if (!selector) {
        throw new Error('Expected form selector context to be captured')
      }

      return selector
    },
    dispose: () => {
      dispose()
      container.remove()
    },
  }
}

describe('form selector context', () => {
  beforeEach(() => {
    disposeEventClientBus = installEventClientBus()
  })

  afterEach(() => {
    disposeEventClientBus?.()
    disposeEventClientBus = undefined
  })

  it('receives forms mounted before the provider mounts once form-devtools is imported', () => {
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const unmountForm = form.mount()
    const { dispose, selector } = renderFormSelector()

    try {
      const mountedForms = selector().mountedForms()

      expect(mountedForms).toHaveLength(1)
      expect(mountedForms[0]).toMatchObject({ formId: 'profile' })
      expect(selector().selectedForm()).toBe(mountedForms[0])
      expect(selector().selectedFormInstanceId()).toBe(
        mountedForms[0]!.instanceId,
      )
    } finally {
      dispose()
      unmountForm()
    }
  })

  it('tracks multiple mounts of the same form as one selector entry', () => {
    const { dispose, selector } = renderFormSelector()
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const unmountFirst = form.mount()
    const unmountSecond = form.mount()

    try {
      expect(selector().mountedForms()).toHaveLength(1)

      unmountFirst()
      expect(selector().mountedForms()).toHaveLength(1)

      unmountSecond()
      expect(selector().mountedForms()).toEqual([])
    } finally {
      unmountSecond()
      unmountFirst()
      dispose()
    }
  })

  it('keeps mounted form state across provider remounts', () => {
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const unmountForm = form.mount()
    const firstRender = renderFormSelector()

    try {
      const firstMountedForms = firstRender.selector().mountedForms()
      const instanceId = firstMountedForms[0]!.instanceId

      expect(firstMountedForms).toEqual([{ formId: 'profile', instanceId }])

      firstRender.dispose()

      const secondRender = renderFormSelector()

      try {
        expect(secondRender.selector().mountedForms()).toEqual([
          { formId: 'profile', instanceId },
        ])
      } finally {
        secondRender.dispose()
      }
    } finally {
      unmountForm()
    }
  })

  it('selects the first available form and falls back when selected form unmounts', () => {
    const { dispose, selector } = renderFormSelector()
    const firstForm = new InternalFormApi({
      formId: 'first',
      defaultValues: { name: '' },
    })
    const secondForm = new InternalFormApi({
      formId: 'second',
      defaultValues: { name: '' },
    })
    const unmountFirstForm = firstForm.mount()
    const unmountSecondForm = secondForm.mount()

    try {
      const mountedForms = selector().mountedForms()
      const firstFormInstanceId = mountedForms[0]!.instanceId
      const secondFormInstanceId = mountedForms[1]!.instanceId

      expect(selector().selectedFormInstanceId()).toBe(firstFormInstanceId)

      selector().setSelectedForm(secondFormInstanceId)
      expect(selector().selectedFormInstanceId()).toBe(secondFormInstanceId)

      selector().setSelectedForm('missing-form-instance')
      expect(selector().selectedFormInstanceId()).toBe(secondFormInstanceId)

      unmountSecondForm()
      expect(selector().selectedFormInstanceId()).toBe(firstFormInstanceId)

      unmountFirstForm()
      expect(selector().mountedForms()).toEqual([])
      expect(selector().selectedForm()).toBeNull()
      expect(selector().selectedFormInstanceId()).toBeNull()
    } finally {
      unmountSecondForm()
      unmountFirstForm()
      dispose()
    }
  })

  it('updates form names without changing selected form instance ids', () => {
    const { dispose, selector } = renderFormSelector()
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const unmountForm = form.mount()

    try {
      const instanceId = selector().mountedForms()[0]!.instanceId

      form._update({
        formId: 'renamed-profile',
        defaultValues: { name: '' },
      })

      expect(selector().mountedForms()).toEqual([
        { formId: 'renamed-profile', instanceId },
      ])
      expect(selector().selectedFormInstanceId()).toBe(instanceId)
    } finally {
      unmountForm()
      dispose()
    }
  })

  it('renders duplicate formId labels with short instance id suffixes', () => {
    const { container, dispose, selector } = renderFormSelector(() => (
      <FormSelector />
    ))
    const firstForm = new InternalFormApi({
      formId: 'shared',
      defaultValues: { name: '' },
    })
    const secondForm = new InternalFormApi({
      formId: 'shared',
      defaultValues: { name: '' },
    })
    const unmountFirstForm = firstForm.mount()
    const unmountSecondForm = secondForm.mount()

    try {
      const mountedForms = selector().mountedForms()
      const select = container.querySelector('select')

      expect(select).not.toBeNull()
      expect(Array.from(select!.options).map((option) => option.value)).toEqual(
        mountedForms.map((form) => form.instanceId),
      )
      expect(Array.from(select!.options).map((option) => option.text)).toEqual([
        `shared (${mountedForms[0]!.instanceId.slice(0, 8)})`,
        `shared (${mountedForms[1]!.instanceId.slice(0, 8)})`,
      ])
    } finally {
      unmountSecondForm()
      unmountFirstForm()
      dispose()
    }
  })
})
