import './App.css'

// UI Components
import { ThemeProvider } from '@/components/dark-light-mode/theme-provider'
import { LoginPage } from '@/components/pages/login-page'
import { Summary } from '@/components/pages/summary-page'
import { DayPage } from '@/components/pages/day-page'
import { Settings } from '@/components/pages/settings-page'
import { Students } from '@/components/pages/students-page'
import { PaymentsPage } from './components/pages/payments-page'
import { Archives } from './components/pages/archives-page'
import { HomePage } from './components/pages/home-page'
import { SignupPage } from './components/pages/signup-page'
import { VerificationPage } from './components/pages/verification-page'

// Routing imports
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
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/verify" element={<VerificationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
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
}

export default App
