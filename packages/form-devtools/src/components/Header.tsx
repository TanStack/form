import { Header as UIHeader } from '@tanstack/devtools-ui'
import { InfoIcon } from 'lucide-solid'
import { FormLogo } from './ui/FormLogo'
import { FormSelector } from './FormSelector'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { Code } from './ui/code'

interface CryptidNameHintProps {
  class?: string
}

function CrypticNameHint(props: CryptidNameHintProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        asChild={(innerProps) => (
          <Button variant="ghost" {...innerProps({ class: props.class })}>
            <InfoIcon />
          </Button>
        )}
      />
      <TooltipContent class="text-center">
        <span>
          Form names looking a bit cryptic?
          <br />
          Add a <Code>formId</Code> option to give it a clearer name.
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

interface HeaderProps {
  adapterName: string | undefined
}

export function Header(props: HeaderProps) {
  return (
    <UIHeader class="border-b-0">
      <FormLogo adapterName={props.adapterName} />
      <FormSelector class="ms-5" />
      <CrypticNameHint class="icon-sm me-auto" />
    </UIHeader>
  )
}
