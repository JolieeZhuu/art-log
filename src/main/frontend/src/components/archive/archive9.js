import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentInfo from "../StudentInfo.js";
import AttendanceList from "./AttendanceList.js";

import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IconContext } from "react-icons";

import "../attendance.css";

function AttendancePage() {
    const navigate = useNavigate();

    function toStudentPage() {
        navigate(`/students`);
    }

    return (
        <div>
            <div>
                <IconContext.Provider value={{ className: "backIcon" }}>
                    <IoIosArrowDropleftCircle onClick={() => {toStudentPage()}}/>
                </IconContext.Provider>
            </div>
            <StudentInfo></StudentInfo>
            <AttendanceList></AttendanceList>
        </div>
    )
}

export default AttendancePage