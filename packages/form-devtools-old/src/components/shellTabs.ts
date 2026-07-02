export const devtoolsTabs = [
  {
    id: 'overview',
    label: 'Overview',
    leftTitle: 'Mounted fields',
    leftDescription: 'Mounted field navigation will appear here.',
    detailTitle: 'Overview',
    detailDescription: 'Form status, key state, and common actions go here.',
  },
  {
    id: 'fields',
    label: 'Fields',
    leftTitle: 'Mounted fields',
    leftDescription: 'MountedFieldsList will render here.',
    detailTitle: 'Field details',
    detailDescription: 'Selected and pinned field inspectors go here.',
  },
  {
    id: 'values',
    label: 'Values',
    leftTitle: 'Values',
    leftDescription: 'Value/default navigation will appear here.',
    detailTitle: 'Values and defaults',
    detailDescription: 'Current values and defaults go here.',
  },
  {
    id: 'errors',
    label: 'Errors',
    leftTitle: 'Error triage',
    leftDescription: 'Current form, group, field, and submit errors go here.',
    detailTitle: 'Error details',
    detailDescription: 'Selected error context and source details go here.',
  },
  {
    id: 'validation',
    label: 'Validation',
    leftTitle: 'Validators',
    leftDescription: 'Validator owners and runtime status go here.',
    detailTitle: 'Validation explorer',
    detailDescription:
      'Validator config, runs, dependencies, and actions go here.',
  },
  {
    id: 'submissions',
    label: 'Submissions',
    leftTitle: 'Submit attempts',
    leftDescription: 'Submission history navigation will appear here.',
    detailTitle: 'Submission timeline',
    detailDescription: 'Attempt outcomes, payloads, and retry actions go here.',
  },
] as const

export type DevtoolsTabId = (typeof devtoolsTabs)[number]['id']

export type DevtoolsTabConfig = (typeof devtoolsTabs)[number]
