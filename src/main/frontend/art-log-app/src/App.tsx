import './App.css'

// component imports
import { ThemeProvider } from '@/components/theme-provider'
import { LoginPage } from '@/components/login-page'
import { Summary } from '@/components/summary-page'
import { DayPage } from '@/components/day-page'
import { Settings } from '@/components/settings-page'
import { Students } from '@/components/students-page'
import { PaymentsPage } from './components/payments-page'
import { Archives } from './components/archives-page'

// routing
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/summary" element={<Summary/>}/>
                    <Route path="/day/:day" element={<DayPage/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/students" element={<Students/>}/>
                    <Route path="/students/:id" element={<PaymentsPage/>}/>
                    <Route path="/students/:id/archives" element={<Archives/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    )
  {
    /*
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div>
                <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
                </button>
                <p>
                Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <ModeToggle/>
            <LoginCard/>
            </ThemeProvider>
        </>
        )
    */
  }
  
}

export default App
