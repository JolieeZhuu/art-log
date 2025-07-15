import "./App.css";
import LoginPage from "./components/LoginPage.js";
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import SummaryPage from "./components/SummaryPage.js";
import Monday from "./components/days/Monday.js";
import Tuesday from "./components/days/Tuesday.js";
import Wednesday from "./components/days/Wednesday.js";
import Thursday from "./components/days/Thursday.js";
import Friday from "./components/days/Friday.js";
import Saturday from "./components/days/Saturday.js";
import Sunday from "./components/days/Sunday.js";
import StudentDB from "./components/StudentDB.js";
import AllPaymentTables from "./components/AllPaymentTables.js";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/summary" element={<SummaryPage/>}/>
                <Route path="/monday" element={<Monday/>}/>
                <Route path="/tuesday" element={<Tuesday/>}/>
                <Route path="/wednesday" element={<Wednesday/>}/>
                <Route path="/thursday" element={<Thursday/>}/>
                <Route path="/friday" element={<Friday/>}/>
                <Route path="/saturday" element={<Saturday/>}/>
                <Route path="/sunday" element={<Sunday/>}/>
                <Route path="/:day/student-database/:id" element={<StudentDB/>}/>
                <Route path="/:day/student-database/:id/tables" element={<AllPaymentTables/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </Router>
    );
};
