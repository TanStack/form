import ReactDOM from 'react-dom/client'
import './index.css'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { BookingForm } from './app/booking/booking-form'

function App() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <BookingForm />
      </div>
      <TanStackDevtools
        plugins={[formDevtoolsPlugin()]}
        config={{
          hideUntilHover: false,
        }}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
