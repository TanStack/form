import { RefreshCcwIcon } from 'lucide-solid'
import { FormLogo } from '../ui/FormLogo'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { ButtonGroup } from '../ui/button-group'
import { Code } from '../ui/code'
import { FormSelector } from './FormSelector'
import { TabsNav } from './TabsNav'
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
    <header class="px-3 pt-2 flex flex-wrap items-start gap-x-5 gap-y-2 border-b-2 border-border dark:border-input [--tab-indicator-bottom:calc(-0.5rem-2px)]">
      <div class="pb-2">
        <FormLogo adapterName={props.adapterName} />
      </div>
      <ButtonGroup class="pb-2">
        <CrypticNameHint class="icon-sm" />
        <FormSelector />
      </ButtonGroup>
      <TabsNav />
    </header>
  )
}
