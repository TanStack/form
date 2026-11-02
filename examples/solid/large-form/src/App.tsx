import { Loading } from 'solid-js'
import { PeoplePage } from './features/people/page'

export default function App() {
  return (
    <Loading fallback={<p>Loading...</p>}>
      <PeoplePage />
    </Loading>
  )
}
