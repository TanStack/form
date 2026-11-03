import { createRoot } from 'octane'

function App() @{
  console.log("Test");

  <p>Testing</p>
}

const target = document.getElementById('root')
if (!target) throw new Error('Missing #root')
createRoot(target).render(App)
