import type { AnyInternalFormApi } from './FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'

/**
 * A listener or validator dependency edge affected by reconciliation.
 */
export interface FieldDependencyChange {
  sourceField: AnyInternalFieldApi
  watchingField: AnyInternalFieldApi
  watcherIndex: number
}

/**
 * Optional hooks installed by `@tanstack/form-devtools`.
 *
 * The core package owns only this narrow lifecycle contract. It passes live
 * form instances to the installed bridge, and the devtools package decides how
 * to transform those instances into serializable event payloads for the panel.
 */
export interface FormDevtoolsBridge {
  /**
   * Called when `form.mount()` runs.
   *
   * Use this to register a form as currently available to Devtools. The same
   * form object is later passed to `unmountForm` when the cleanup returned by
   * `form.mount()` runs.
   */
  mountForm?: (form: AnyInternalFormApi) => void
  /**
   * Called when a mounted form's `form.mount()` cleanup runs.
   *
   * Use this to remove the form from Devtools-owned mounted-form state and to
   * clean up subscriptions associated with that form.
   */
  unmountForm?: (form: AnyInternalFormApi) => void
  /**
   * Called after `form._update(options)` applies new options.
   *
   * Use this for Devtools metadata that can change without a new form instance,
   * such as `form.formId`. This hook may run often in framework adapters, so
   * the bridge should ignore updates that do not change Devtools-visible data.
   */
  updateForm?: (form: AnyInternalFormApi) => void
  /**
   * Called after a field's meta state updates.
   *
   * Use this for Devtools data derived from field meta, such as field-list
   * summary flags. This hook may run often, so the bridge should ignore fields
   * whose form is not currently subscribed.
   */
  updateField?: (field: AnyInternalFieldApi) => void
  /**
   * Called after a field is inserted into the form field trie.
   */
  fieldAdded?: (field: AnyInternalFieldApi) => void
  /**
   * Called after listener or validator dependency edges change. Attached and
   * detached edges are both included so removed endpoints remain observable.
   */
  fieldDependenciesChanged?: (
    changes: ReadonlyArray<FieldDependencyChange>,
  ) => void
  /**
   * Called when a field's component registration count transitions from 0 to 1.
   *
   * Use this to add mounted fields to Devtools-owned field-list state.
   */
  mountField?: (field: AnyInternalFieldApi) => void
  /**
   * Called when a field's component registration count transitions from 1 to 0.
   *
   * `previousPath` is captured before the field can be pruned or moved, so the
   * bridge can clean up path-indexed state without reading stale tree data.
   */
  unmountField?: (field: AnyInternalFieldApi, previousPath: string) => void
  /**
   * Called after a field moves to a new path, usually because of array
   * operations such as move, swap, insert, or remove.
   */
  moveField?: (field: AnyInternalFieldApi, previousPath: string) => void
  /**
   * Called after a field subtree is removed from the form field tree.
   *
   * The field objects are passed only as live internals for the installed
   * bridge. Event payload conversion still belongs to `@tanstack/form-devtools`.
   */
  removeFieldSubtree?: (
    form: AnyInternalFormApi,
    fields: Array<{ field: AnyInternalFieldApi; previousPath: string }>,
  ) => void
}

let activeBridge: FormDevtoolsBridge | null = null

/**
 * Installs the active Devtools bridge for form-core lifecycle notifications.
 *
 * This is intentionally an internals-only API. Form Devtools calls it when the
 * Devtools panel/context is mounted, and core runtime code reads the active
 * bridge through `devtools()`. The returned cleanup removes this bridge only if
 * it is still the active bridge.
 */
export function installDevtoolsBridge(bridge: FormDevtoolsBridge): () => void {
  activeBridge = bridge

  let didUninstall = false

  return () => {
    if (didUninstall) return
    didUninstall = true

    if (activeBridge !== bridge) return

    activeBridge = null
  }
}

/**
 * Returns the active bridge, or an empty bridge object when Devtools is absent.
 *
 * Core call sites use optional hook calls on this value so normal form-core
 * users do not pay for Devtools dependencies or event payload logic.
 */
export function devtools(): FormDevtoolsBridge {
  // Double conditional chains are dumb, so I prefer this approach
  return activeBridge ?? {}
}
