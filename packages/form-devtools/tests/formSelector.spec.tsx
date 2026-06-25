import { render } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { ThemeContextProvider } from '@tanstack/devtools-ui'
import { InternalFormApi } from '@tanstack/form-core/internals'
import { Shell } from '../src/components/Shell'
import {
  FormEventClientProvider,
  useFormEventClient,
} from '../src/contexts/eventClientContext'
import { getDevtoolsFormKey } from '../src/stores/eventClientTypes'

type FormEventClient = ReturnType<typeof useFormEventClient>

function installEventClientHandshake() {
  const onConnect = () => {
    window.dispatchEvent(new CustomEvent('tanstack-connect-success'))
  }

  window.addEventListener('tanstack-connect', onConnect)

  return () => {
    window.removeEventListener('tanstack-connect', onConnect)
  }
}

function CaptureClient(props: { onClient: (client: FormEventClient) => void }) {
  props.onClient(useFormEventClient())
  return null
}

function renderEventClient() {
  const disposeHandshake = installEventClientHandshake()
  let client: FormEventClient | undefined
  const container = document.createElement('div')
  document.body.append(container)
  const dispose = render(
    () => (
      <FormEventClientProvider>
        <CaptureClient
          onClient={(nextClient) => {
            client = nextClient
          }}
        />
      </FormEventClientProvider>
    ),
    container,
  )

  return {
    client: () => {
      if (!client) {
        throw new Error('Expected form event client to be captured')
      }

      return client
    },
    dispose: () => {
      dispose()
      container.remove()
      disposeHandshake()
    },
  }
}

function renderShell() {
  const disposeHandshake = installEventClientHandshake()
  let client: FormEventClient | undefined
  const container = document.createElement('div')
  document.body.append(container)
  const dispose = render(
    () => (
      <ThemeContextProvider theme="light">
        <FormEventClientProvider>
          <CaptureClient
            onClient={(nextClient) => {
              client = nextClient
            }}
          />
          <Shell adapterName="Solid" />
        </FormEventClientProvider>
      </ThemeContextProvider>
    ),
    container,
  )

  return {
    client: () => {
      if (!client) {
        throw new Error('Expected form event client to be captured')
      }

      return client
    },
    container,
    dispose: () => {
      dispose()
      container.remove()
      disposeHandshake()
    },
  }
}

describe('form selector', () => {
  it('replays forms that mounted before the devtools store mounted', () => {
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const unmountForm = form.mount()
    const { client, dispose } = renderEventClient()

    try {
      const forms = client().store()

      expect(forms).toHaveLength(1)
      expect(forms[0]).toMatchObject({
        id: 'profile',
      })
      expect(client().activeFormKey()).toBe(getDevtoolsFormKey(forms[0]!))
    } finally {
      dispose()
      unmountForm()
    }
  })

  it('selects mounted forms and falls back when the selected form unmounts', () => {
    const { client, dispose } = renderEventClient()
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
      const forms = client().store()
      const firstFormKey = getDevtoolsFormKey(forms[0]!)
      const secondFormKey = getDevtoolsFormKey(forms[1]!)

      expect(client().activeFormKey()).toBe(firstFormKey)

      client().selectForm(secondFormKey)
      expect(client().activeFormKey()).toBe(secondFormKey)

      client().selectForm('missing-form')
      expect(client().activeFormKey()).toBe(secondFormKey)

      unmountSecondForm()
      expect(client().activeFormKey()).toBe(firstFormKey)

      unmountFirstForm()
      expect(client().store()).toEqual([])
      expect(client().activeFormKey()).toBeNull()
    } finally {
      dispose()
    }
  })

  it('renders form options and updates selection from the header select', () => {
    const { client, container, dispose } = renderShell()
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
      const forms = client().store()
      const firstFormKey = getDevtoolsFormKey(forms[0]!)
      const secondFormKey = getDevtoolsFormKey(forms[1]!)
      const select = container.querySelector('select')

      expect(select).not.toBeNull()
      expect(select?.value).toBe(firstFormKey)
      expect(Array.from(select!.options).map((option) => option.value)).toEqual(
        [firstFormKey, secondFormKey],
      )
      expect(Array.from(select!.options).map((option) => option.text)).toEqual([
        `shared (${forms[0]!.instanceId.slice(0, 8)})`,
        `shared (${forms[1]!.instanceId.slice(0, 8)})`,
      ])

      select!.value = secondFormKey
      select!.dispatchEvent(new Event('input', { bubbles: true }))

      expect(client().activeFormKey()).toBe(secondFormKey)
      expect(container.querySelector('select')?.value).toBe(secondFormKey)
    } finally {
      unmountSecondForm()
      unmountFirstForm()
      dispose()
    }
  })
})
