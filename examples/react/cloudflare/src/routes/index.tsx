import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  useForm({
    defaultValues: {
      name: 'World',
    },
  })

  return (
    <main>
      <h1>Hello world!</h1>
    </main>
  )
}
