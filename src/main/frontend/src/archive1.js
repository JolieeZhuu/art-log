

import './App.css';
//import Login from './components/Login';
import LoginPage from "./components/LoginPage.js";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from './components/Signup';
import StudentPage from './components/StudentPage';
import AttendancePage from './components/AttendancePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />}/> 
        
        
        <Route path="/signup" element={<Signup />}/>
        <Route path="/attendance" element={<AttendancePage />}/>
        */}
        <Route path="/students" element={<StudentPage />}/>
        <Route path="/" element={<LoginPage />}/>
        <Route
            path="*"
            element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;