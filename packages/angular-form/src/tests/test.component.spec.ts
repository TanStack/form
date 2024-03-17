import { render, screen } from '@testing-library/angular'
import { TestComponent } from '../test.component.ts'

describe('TestComponent', () => {
  test('should show message', async () => {
    await render(TestComponent)

    expect(screen.getByText('Testing')).toBeInTheDocument()
  })
})
