import { Loader2Icon } from 'lucide-react'
import { cn } from '@/helpers/utils'

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<'svg'>, 'ref'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
