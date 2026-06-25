export const devtoolsTabs = [
  {
    id: 'overview',
    label: 'Overview',
  },
  {
    id: 'fields',
    label: 'Fields',
  },
  {
    id: 'values',
    label: 'Values',
  },
  {
    id: 'errors',
    label: 'Errors',
  },
  {
    id: 'validation',
    label: 'Validation',
  },
  {
    id: 'submissions',
    label: 'Submissions',
  },
] as const

export type DevtoolsTabId = (typeof devtoolsTabs)[number]['id']

export type DevtoolsTabConfig = (typeof devtoolsTabs)[number]
