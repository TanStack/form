import { Header } from './header/Header'
import type { FormDevtoolsInit } from '@/core'

type DevtoolsProps = FormDevtoolsInit

export function Shell(props: DevtoolsProps) {
  return (
    <>
      <Header adapterName={props.adapterName} />
      {/* <FormTabsRoot>
        <FormTabsList />
        <FormTabContent value="field">Field</FormTabContent>
        <FormTabContent value="form">Form</FormTabContent>
        <FormTabContent value="validation">Validation</FormTabContent>
      </FormTabsRoot> */}
    </>
  )
}
