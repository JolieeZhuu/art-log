import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StudentsProvider } from './components/student-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudentsProvider>
        <App />
    </StudentsProvider>
  </StrictMode>,
)
