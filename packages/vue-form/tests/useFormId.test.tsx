import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { useForm } from '../src'

const Comp = defineComponent(() => {
  const form = useForm({ defaultValues: { firstName: '' } })

  return () => <form id={form.formId} data-testid="form" />
})

describe('useFormId', () => {
  it('uses the provided formId when one is given', () => {
    const WithId = defineComponent(() => {
      const form = useForm({
        defaultValues: { firstName: '' },
        formId: 'my-form',
      })

      return () => <form id={form.formId} data-testid="form" />
    })

    const { getByTestId } = render(WithId)

    expect(getByTestId('form').getAttribute('id')).toBe('my-form')
  })

  it('generates the same default formId across identical renders', () => {
    // Scoped to each render's own container: both mount into `document.body`,
    // so a document-wide query would find each other's form too.
    const first = render(Comp).container.querySelector('form')?.id
    const second = render(Comp).container.querySelector('form')?.id

    expect(first).toBeTruthy()
    expect(second).toBe(first)
  })

  it('generates a default formId that matches between server and client', async () => {
    const html = await renderToString(createSSRApp(Comp))
    // `\s` so this doesn't match the `id="` inside `data-testid="..."`
    const serverId = html.match(/\sid="([^"]*)"/)?.[1]

    const clientId = render(Comp).getByTestId('form').getAttribute('id')

    expect(serverId).toBeTruthy()
    expect(clientId).toBe(serverId)
  })
})
