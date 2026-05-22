import ReactDOM from 'react-dom/client'
import './index.css'
import { BookingForm } from './app/booking/booking-form'

function App() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <BookingForm />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
