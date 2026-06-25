import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import { devtools } from '../src/devtoolsBridge.lib'

describe('devtools bridge', () => {
  it('mounts already mounted forms when a bridge is installed', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const unmountForm = form.mount()
    const cleanupForm = vi.fn()
    const mountForm = vi.fn(() => cleanupForm)

    const uninstallBridge = devtools.installBridge({ mountForm })

    expect(mountForm).toHaveBeenCalledWith(form)

    uninstallBridge()

    expect(cleanupForm).toHaveBeenCalledWith('bridge-uninstalled')

    unmountForm()
  })

  it('cleans up a mounted form after its final unmount', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const cleanupForm = vi.fn()
    const mountForm = vi.fn(() => cleanupForm)
    const uninstallBridge = devtools.installBridge({ mountForm })

    const unmountFirstRef = form.mount()
    const unmountSecondRef = form.mount()

    expect(mountForm).toHaveBeenCalledOnce()

    unmountFirstRef()

    expect(cleanupForm).not.toHaveBeenCalled()

    unmountSecondRef()

    expect(cleanupForm).toHaveBeenCalledWith('form-unmounted')

    uninstallBridge()
  })
})
