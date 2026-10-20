import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import { installDevtoolsBridge } from '../src/devtoolsBridge.lib'

describe('installDevtoolsBridge', () => {
  it('reports a field mount once and unmounts it after its last consumer unregisters', async ({
    onTestFinished,
  }) => {
    vi.useFakeTimers()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const mountField = vi.fn()
    const unmountField = vi.fn()
    const uninstall = installDevtoolsBridge({ mountField, unmountField })
    onTestFinished(uninstall)

    const unregisterFirst = field._register()
    const unregisterSecond = field._register()

    expect(mountField).toHaveBeenCalledOnce()
    expect(mountField).toHaveBeenCalledWith(field)

    unregisterFirst()
    expect(unmountField).not.toHaveBeenCalled()

    unregisterSecond()
    await vi.runOnlyPendingTimersAsync()

    expect(unmountField).toHaveBeenCalledOnce()
    expect(unmountField).toHaveBeenCalledWith(field, 'name')
  })

  it('reports moved fields with their previous paths after an array swap', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b'] },
    })
    const first = form._getOrCreateFieldApi({ name: 'items[0]' })
    const second = form._getOrCreateFieldApi({ name: 'items[1]' })
    const moveField = vi.fn()
    const uninstall = installDevtoolsBridge({ moveField })
    onTestFinished(uninstall)

    form.swapFieldValues('items', 0, 1)

    expect(moveField).toHaveBeenCalledWith(first, 'items[0]')
    expect(moveField).toHaveBeenCalledWith(second, 'items[1]')
    expect(first.name).toBe('items[1]')
    expect(second.name).toBe('items[0]')
    expect(form.state.values.items).toEqual(['b', 'a'])
  })

  it('reports updates for a changed field and its parent even when both are already dirty', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const field = form._getOrCreateFieldApi({ name: 'user.name' })
    const updateField = vi.fn()
    const uninstall = installDevtoolsBridge({ updateField })
    onTestFinished(uninstall)

    field.handleChange('first')

    expect(field.meta.isDirty).toBe(true)
    expect(parent.meta.isDirty).toBe(true)
    expect(updateField).toHaveBeenCalledWith(field)
    expect(updateField).toHaveBeenCalledWith(parent)
    updateField.mockClear()

    field.handleChange('second')

    expect(field.meta.isDirty).toBe(true)
    expect(parent.meta.isDirty).toBe(true)
    expect(field.value).toBe('second')
    expect(parent.value).toEqual({ name: 'second' })
    expect(updateField).toHaveBeenCalledWith(field)
    expect(updateField).toHaveBeenCalledWith(parent)
  })

  it('reports field resets and updated defaults that bypass change events', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const updateField = vi.fn()
    const uninstall = installDevtoolsBridge({ updateField })
    onTestFinished(uninstall)

    field.handleChange('changed')
    updateField.mockClear()

    form.resetField('name')

    expect(field.value).toBe('')
    expect(updateField).toHaveBeenCalledWith(field)
    updateField.mockClear()

    form._update({ defaultValues: { name: 'new default' } })

    expect(field.value).toBe('new default')
    expect(updateField).toHaveBeenCalledWith(field)
  })

  it('reports every removed field in a subtree with its previous path', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const child = form._getOrCreateFieldApi({ name: 'user.name' })
    const removeFieldSubtree = vi.fn()
    const uninstall = installDevtoolsBridge({ removeFieldSubtree })
    onTestFinished(uninstall)

    form.deleteField('user')

    expect(removeFieldSubtree).toHaveBeenCalledOnce()
    expect(removeFieldSubtree).toHaveBeenCalledWith(form, [
      { field: parent, previousPath: 'user' },
      { field: child, previousPath: 'user.name' },
    ])
  })

  it('reports fields added beneath an existing parent', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      defaultValues: { user: { name: 'Alice' } },
    })
    form._getOrCreateFieldApi({ name: 'user' })
    const fieldAdded = vi.fn()
    const uninstall = installDevtoolsBridge({ fieldAdded })
    onTestFinished(uninstall)

    const child = form._getOrCreateFieldApi({ name: 'user.name' })

    expect(fieldAdded).toHaveBeenCalledWith(child)
    expect(child.name).toBe('user.name')
    expect(child.value).toBe('Alice')
  })

  it('reports listener dependency endpoints when attached and when the watching field is deleted', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      defaultValues: { source: '', target: 'target' },
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const target = form._getOrCreateFieldApi({ name: 'target' })
    source._register()
    target._register()
    const listener = vi.fn()
    const fieldDependenciesChanged = vi.fn()
    const uninstall = installDevtoolsBridge({ fieldDependenciesChanged })
    onTestFinished(uninstall)

    target._update({
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: listener },
      ],
    })

    expect(fieldDependenciesChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        kind: 'listener',
        sourceField: source,
        watchingField: target,
        listenerInstance: expect.anything(),
      }),
    ])

    source.handleChange('first')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'target', fieldApi: target }),
    )
    listener.mockClear()
    fieldDependenciesChanged.mockClear()

    form.deleteField('target')

    expect(fieldDependenciesChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        kind: 'listener',
        sourceField: source,
        watchingField: target,
        listenerInstance: expect.anything(),
      }),
    ])

    source.handleChange('after deletion')
    expect(listener).not.toHaveBeenCalled()
  })

  it('receives form mount, update, and unmount notifications', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      formId: 'profile-form',
      defaultValues: { name: '' },
    })
    const mountForm = vi.fn()
    const unmountForm = vi.fn()
    const updateForm = vi.fn()
    const uninstall = installDevtoolsBridge({
      mountForm,
      unmountForm,
      updateForm,
    })
    onTestFinished(uninstall)

    const unmount = form.mount()
    onTestFinished(unmount)
    expect(mountForm).toHaveBeenCalledWith(form)

    form._update({
      formId: 'renamed-profile-form',
      defaultValues: { name: '' },
    })

    expect(updateForm).toHaveBeenCalledWith(form)

    unmount()

    expect(unmountForm).toHaveBeenCalledWith(form)
  })

  it('stops lifecycle notifications after the bridge is uninstalled', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      formId: 'profile-form',
      defaultValues: { name: '' },
    })
    const mountForm = vi.fn()
    const unmountForm = vi.fn()
    const updateForm = vi.fn()
    const uninstall = installDevtoolsBridge({
      mountForm,
      unmountForm,
      updateForm,
    })
    onTestFinished(uninstall)

    const unmount = form.mount()
    onTestFinished(unmount)
    expect(mountForm).toHaveBeenCalledWith(form)
    mountForm.mockClear()

    uninstall()

    const unmountAfterUninstall = form.mount()
    onTestFinished(unmountAfterUninstall)
    form._update({
      formId: 'renamed-profile-form',
      defaultValues: { name: '' },
    })
    unmount()
    unmountAfterUninstall()

    expect(mountForm).not.toHaveBeenCalled()
    expect(updateForm).not.toHaveBeenCalled()
    expect(unmountForm).not.toHaveBeenCalled()
  })
})
