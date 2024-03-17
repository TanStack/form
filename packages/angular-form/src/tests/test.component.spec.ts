import { render, screen } from '@testing-library/angular'
import { Component } from '@angular/core'

@Component({
  selector: 'test-component',
  standalone: true,
  template: ` <p>Testing</p> `,
})
class TestComponent {}

describe('TestComponent', () => {
  test('should show message', async () => {
    await render(TestComponent)

    expect(screen.getByText('Testing')).toBeInTheDocument()
  })
})
