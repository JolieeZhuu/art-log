import './App.css'

// component imports
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { LoginPage } from '@/components/login-page'
import { SummaryPage } from '@/components/summary-page'
import { Monday } from '@/components/monday'
import Layout from '@/components/layout'

// routing
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/summary" element={<SummaryPage/>}/>
                        <Route path="/monday" element={<Monday/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Router>
                <ModeToggle/>
            </ThemeProvider>
        </>
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
