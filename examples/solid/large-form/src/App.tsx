import { Suspense } from 'solid-js'
import { PeoplePage } from './features/people/page'

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PeoplePage />
    </Suspense>
  )
}
