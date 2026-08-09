import { getFieldGroupHelpers } from '../../src/index.js'
import { nameFields } from './field-definition.js'
import NameFieldsImpl from './NameFieldsImpl.svelte'

const { withFields } = getFieldGroupHelpers()

export const NameFields = withFields(nameFields, NameFieldsImpl, 'fields')
