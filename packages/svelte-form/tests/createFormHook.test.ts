import { render } from 'vitest-browser-svelte'
import { describe, expect, it } from 'vitest'
import DefaultOptions from './adapter/DefaultOptions.svelte'

describe('createFormHook defaults', () => {
  it('applies form, field, and form group defaults through public components', async () => {
    const view = await render(DefaultOptions)

    await view.getByRole('button', { name: 'Change direct field' }).click()
    await view
      .getByRole('button', { name: 'Change direct array field' })
      .click()
    await view.getByRole('button', { name: 'Change grouped field' }).click()
    await view
      .getByRole('button', { name: 'Change grouped array field' })
      .click()

    expect(view.getByTestId('form-calls')).toHaveTextContent(
      'default,local,default,local,default,local,default,local',
    )
    expect(view.getByTestId('field-calls')).toHaveTextContent(
      'local:direct,default:direct,default:directArray,default:group.field,default:group.array',
    )

    await view.getByRole('button', { name: 'Submit group' }).click()
    expect(view.getByTestId('invalid-calls')).toHaveTextContent('1')
  })
})
