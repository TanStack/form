import { useState } from 'react'
import { createForm } from '@tanstack/form-core-v2'

import type {  FormOptions } from '@tanstack/form-core-v2'


export function useForm<TData>(options: FormOptions<TData>) {
  const [form] = useState(() => createForm(options))

  return form
}
