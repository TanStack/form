import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import DefaultOptions from './adapter/DefaultOptions.svelte'

describe('createFormHook defaults', () => {
  it('applies form, field, and form group defaults through public components', async () => {
    const user = userEvent.setup()
    const view = render(DefaultOptions)

    await user.click(view.getByRole('button', { name: 'Change direct field' }))
    await user.click(
      view.getByRole('button', { name: 'Change direct array field' }),
    )
    await user.click(view.getByRole('button', { name: 'Change grouped field' }))
    await user.click(
      view.getByRole('button', { name: 'Change grouped array field' }),
    )

    expect(view.getByTestId('form-calls')).toHaveTextContent(
      'default,local,default,local,default,local,default,local',
    )
    expect(view.getByTestId('field-calls')).toHaveTextContent(
      'local:direct,default:direct,default:directArray,default:group.field,default:group.array',
    )

    await user.click(view.getByRole('button', { name: 'Submit group' }))
    expect(view.getByTestId('invalid-calls')).toHaveTextContent('1')
  })
})
