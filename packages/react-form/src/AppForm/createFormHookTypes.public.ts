import type {
  UseAppFormHook,
  UseNullableSchemaAppFormHook,
  UseSchemaAppFormHook,
} from './useAppFormTypes.public'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyReactFormComponentMap } from './componentMap.public'

export interface AppFormHookResult<
  TComponents extends AnyReactFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  useSchemaAppForm: UseSchemaAppFormHook<TComponents>
  useAppForm: UseAppFormHook<TComponents>
  useNullableSchemaAppForm: UseNullableSchemaAppFormHook<TComponents>
}
