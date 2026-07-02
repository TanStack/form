import { HeaderLogo } from '@tanstack/devtools-ui'
import { InternalFormApi } from '@tanstack/form-core/internals'

function getLabel(adapterName: string | undefined) {
  return `${adapterName} Form v${InternalFormApi.majorVersion}`.trim()
}

interface FormLogoProps {
  adapterName: string | undefined
}

export function FormLogo(props: FormLogoProps) {
  return (
    <HeaderLogo
      flavor={{ light: '#eeaf00', dark: '#eeaf00' }}
      onClick={() => {
        window.open('https://tanstack.com/form/latest/docs/overview', '_blank')
      }}
    >
      {getLabel(props.adapterName)}
    </HeaderLogo>
  )
}
