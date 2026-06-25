import { Header, HeaderLogo, MainPanel } from '@tanstack/devtools-ui'
import { useFormEventClient } from '../contexts/eventClientContext'

interface ShellProps {
  adapterName?: string
}

export function Shell(props: ShellProps) {
  const eventClient = useFormEventClient()

  return (
    <MainPanel>
      <Header>
        <HeaderLogo flavor={{ light: '#eeaf00', dark: '#eeaf00' }}>
          {props.adapterName ? `${props.adapterName} ` : ''}Form v2
        </HeaderLogo>
      </Header>
      <div
        style={{
          padding: '1rem',
          color: 'var(--tsd-text-color)',
          'font-size': '0.8125rem',
        }}
        data-plugin-id={eventClient.getPluginId()}
      >
        Devtools shell
      </div>
    </MainPanel>
  )
}
