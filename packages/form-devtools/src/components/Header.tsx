import { Header as UIHeader } from '@tanstack/devtools-ui'
import { RefreshCcwIcon } from 'lucide-solid'
import { FormLogo } from './ui/FormLogo'
import { FormSelector } from './FormSelector'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { ButtonGroup } from './ui/button-group'
import { Code } from './ui/code'
import { formDevtoolsEventClient } from '@/eventClient.lib'

interface CryptidNameHintProps {
  class?: string
}

function CrypticNameHint(props: CryptidNameHintProps) {
  function handleRefreshClick() {
    formDevtoolsEventClient.emit('request-mounted-forms', {})
  }

  return (
    <Tooltip openDelay={400}>
      <TooltipTrigger
        asChild={(innerProps) => (
          <Button
            variant="outline"
            size="icon"
            {...innerProps({
              class: props.class,
              onClick: handleRefreshClick,
            })}
          >
            <RefreshCcwIcon />
          </Button>
        )}
      />
      <TooltipContent class="text-center">
        <span>
          Refresh the mounted forms list.
          <br />
          <br />
          Form names looking a bit cryptic? Add a <Code>formId</Code> option to
          give it a clearer name.
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
      <ButtonGroup class="ms-5 me-auto">
        <CrypticNameHint class="icon-sm" />
        <FormSelector />
      </ButtonGroup>
    </UIHeader>
  )
}
