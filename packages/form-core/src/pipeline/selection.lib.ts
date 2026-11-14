export type PipelineSelection = 'run' | 'skip' | 'cancel'

export type PipelineCondition<TContext> =
  boolean | ((context: TContext) => boolean)

export type PipelineTrigger<TEvent extends string, TContext> =
  TEvent | { trigger: TEvent; when?: PipelineCondition<TContext> }

export function isConditionMet<TContext>(
  condition: PipelineCondition<TContext>,
  createPredicateContext?: () => TContext,
): boolean {
  if (typeof condition === 'boolean') return condition
  if (!createPredicateContext) return false

  return condition(createPredicateContext())
}

export function selectTriggers<TEvent extends string, TContext>(
  triggers: ReadonlyArray<PipelineTrigger<TEvent, TContext>> | undefined,
  event: string,
  createPredicateContext?: () => TContext,
): PipelineSelection {
  let matched = false
  for (const trigger of triggers ?? []) {
    if ((typeof trigger === 'string' ? trigger : trigger.trigger) !== event)
      continue

    matched = true
    if (
      typeof trigger === 'string' ||
      isConditionMet(trigger.when ?? true, createPredicateContext)
    )
      return 'run'
  }
  return matched ? 'cancel' : 'skip'
}

export function resolveDebounceMs<TContext>(
  definition: {
    triggerDebounceMs?: number | ((context: TContext) => number)
  },
  event: string,
  createPredicateContext: () => TContext,
): number {
  if (event !== 'change' && event !== 'blur') return 0
  if (definition.triggerDebounceMs === undefined) return 0

  if (typeof definition.triggerDebounceMs === 'function') {
    return definition.triggerDebounceMs(createPredicateContext())
  } else {
    return definition.triggerDebounceMs
  }
}
