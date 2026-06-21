import type {
  MemoryConfig,
  ScenarioDefinition,
  ScenarioId,
  ScenarioSizeKind,
  ScenarioVariant,
  SpeedConfig,
} from './browser-bench.types'

const defaultSpeed: SpeedConfig = {
  warmups: 10,
  iterations: 50,
}

const renderSpeed: SpeedConfig = {
  warmups: 5,
  iterations: 25,
}

const arraySpeed: SpeedConfig = {
  warmups: 5,
  iterations: 30,
}

const defaultMemory: MemoryConfig = {
  samples: 5,
  interactions: 10,
}

export const scenarioDefinitions: Array<ScenarioDefinition> = [
  {
    id: 'render-many-fields',
    sizeKind: 'fieldCount',
    sizes: [10, 100, 500],
    speed: renderSpeed,
    memory: defaultMemory,
  },
  {
    id: 'change-one-field',
    sizeKind: 'fieldCount',
    sizes: [10, 100, 500],
    speed: defaultSpeed,
    memory: defaultMemory,
  },
  {
    id: 'validation-on-change',
    sizeKind: 'fieldCount',
    sizes: [10, 100, 500],
    speed: defaultSpeed,
    memory: defaultMemory,
  },
  {
    id: 'dependent-field-update',
    sizeKind: 'fieldCount',
    sizes: [10, 100, 500],
    speed: defaultSpeed,
    memory: defaultMemory,
  },
  {
    id: 'array-swap',
    sizeKind: 'itemCount',
    sizes: [10, 100],
    speed: arraySpeed,
    memory: defaultMemory,
  },
  {
    id: 'array-move',
    sizeKind: 'itemCount',
    sizes: [10, 100],
    speed: arraySpeed,
    memory: defaultMemory,
  },
  {
    id: 'array-insert-remove',
    sizeKind: 'itemCount',
    sizes: [10, 100],
    speed: arraySpeed,
    memory: defaultMemory,
  },
  {
    id: 'form-group-scoped-validation',
    sizeKind: 'fieldCount',
    sizes: [10, 100],
    speed: defaultSpeed,
    memory: defaultMemory,
  },
]

export function getScenarioDefinition(id: string): ScenarioDefinition {
  const definition = scenarioDefinitions.find((item) => item.id === id)
  if (!definition) {
    throw new Error(`Unknown browser benchmark scenario: ${id}`)
  }
  return definition
}

export function getScenarioVariants(): Array<ScenarioVariant> {
  return scenarioDefinitions.flatMap((definition) =>
    definition.sizes.map((size) => ({
      id: definition.id,
      size,
      sizeKind: definition.sizeKind,
      speed: definition.speed,
      memory: definition.memory,
    })),
  )
}

export function parseScenarioVariant(params: URLSearchParams): ScenarioVariant {
  const id = params.get('scenario')
  if (!id) {
    throw new Error('Missing required "scenario" query parameter')
  }

  const definition = getScenarioDefinition(id)
  const size = getSize(params, definition.sizeKind)

  if (!definition.sizes.includes(size)) {
    throw new Error(
      `Unsupported ${definition.sizeKind} ${size} for scenario "${definition.id}"`,
    )
  }

  return {
    id: definition.id,
    size,
    sizeKind: definition.sizeKind,
    speed: definition.speed,
    memory: definition.memory,
  }
}

export function scenarioVariantToSearchParams(
  implementation: string,
  variant: ScenarioVariant,
): URLSearchParams {
  const params = new URLSearchParams({
    implementation,
    scenario: variant.id,
    fieldCount: String(variant.size),
  })

  if (variant.sizeKind === 'itemCount') {
    params.set('itemCount', String(variant.size))
  }

  return params
}

function getSize(
  params: URLSearchParams,
  sizeKind: ScenarioSizeKind,
): number {
  const sizeParam =
    sizeKind === 'itemCount'
      ? (params.get('itemCount') ?? params.get('fieldCount'))
      : params.get('fieldCount')

  const size = Number(sizeParam)
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(`Invalid or missing ${sizeKind} query parameter`)
  }

  return size
}

export function isScenarioId(value: string): value is ScenarioId {
  return scenarioDefinitions.some((definition) => definition.id === value)
}
