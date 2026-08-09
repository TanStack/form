import { nameFieldGroup } from './field-definition.js'
import NameFieldsImpl from './NameFieldsImpl.svelte'

export const NameFields = nameFieldGroup.bindComponent(NameFieldsImpl, 'fields')
