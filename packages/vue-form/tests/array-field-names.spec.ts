import { render } from 'vitest-browser-vue'
import { describe, expect, it } from 'vitest'
import ArrayFieldNames from './fixtures/ArrayFieldNames.vue'

// Array mutations move existing field APIs to new names. With keyed items the
// same field API is reused under the new name, so nothing else about the field
// changes and consumers must still pick up the new `name`.
const cases = [
  {
    action: 'Remove first',
    titles: 'b:B,c:C',
    names: { b: 'items[0].title', c: 'items[1].title' },
    edit: { id: 'b', value: 'B2', titles: 'b:B2,c:C' },
  },
  {
    action: 'Swap first two',
    titles: 'b:B,a:A,c:C',
    names: { b: 'items[0].title', a: 'items[1].title', c: 'items[2].title' },
    edit: { id: 'a', value: 'A2', titles: 'b:B,a:A2,c:C' },
  },
  {
    action: 'Move first to last',
    titles: 'b:B,c:C,a:A',
    names: { b: 'items[0].title', c: 'items[1].title', a: 'items[2].title' },
    edit: { id: 'a', value: 'A2', titles: 'b:B,c:C,a:A2' },
  },
  {
    action: 'Insert first',
    titles: 'z:Z,a:A,b:B,c:C',
    names: {
      z: 'items[0].title',
      a: 'items[1].title',
      b: 'items[2].title',
      c: 'items[3].title',
    },
    edit: { id: 'c', value: 'C2', titles: 'z:Z,a:A,b:B,c:C2' },
  },
] as const

describe.each(['slot', 'injected'] as const)(
  'Vue field names after array mutations (%s)',
  (mode) => {
    it.each(cases)(
      '$action keeps names current for keyed items',
      async ({ action, titles, names, edit }) => {
        const view = await render(ArrayFieldNames, { props: { mode } })

        await view.getByRole('button', { name: action }).click()
        await expect
          .element(view.getByTestId('titles'))
          .toHaveTextContent(titles)

        for (const [id, name] of Object.entries(names)) {
          await expect
            .element(view.getByTestId(`name-${id}`))
            .toHaveTextContent(name)
          await expect
            .element(view.getByRole('textbox', { name: id }))
            .toHaveAttribute('name', name)
        }

        // Handlers still target the moved field.
        await view.getByRole('textbox', { name: edit.id }).fill(edit.value)
        await expect
          .element(view.getByTestId('titles'))
          .toHaveTextContent(edit.titles)
      },
    )
  },
)
