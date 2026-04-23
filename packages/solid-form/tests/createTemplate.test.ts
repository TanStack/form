import { describe, it, expect } from 'vitest'
import { createTemplate } from '@tanstack/template'

describe('createTemplateSignal', () => {
  it('should work with template', () => {
    const template = createTemplate()
    expect(template).toBeDefined()
    expect(template.store.state.message).toBe('Hello')
  })
})
