import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import { installDevtoolsBridge } from '../src/devtoolsBridge.lib'

describe('installDevtoolsBridge', () => {
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
