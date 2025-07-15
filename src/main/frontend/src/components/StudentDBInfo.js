// external imports
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// internal imports
import { Controller } from "../restAPI/entities";

export default function StudentDBInfo({ id, cssIDName, day }) {
    // initializations
    const [infoData, setInfoData] = useState([]);
    const studentUrl = "http://localhost:8080/student/";
    const navigate = useNavigate();

    const refreshStudentInfo = useCallback(async () => {
        const requests = new Controller();
        const studentInfo = await requests.getById(studentUrl, id);
        setInfoData(studentInfo);
    }, [id])

    useEffect(() => {
        refreshStudentInfo();
    }, [refreshStudentInfo])

    function backButton() {
        navigate(`/${day}`);
    }

    return (
        <div>
            <div className="header">
                <h2>{infoData.first_name} {infoData.last_name}</h2>
                <button onClick={backButton}>
                    Back to {day[0].toUpperCase() + day.substring(1, day.length)}
                </button>
            </div>
            
            <div className="css-student-info">
                <div>
                    <label>Day</label>
                    <p className="indiv-info">{infoData.day}</p>
                </div>
                <div>
                    <label>Class</label>
                    <p className="indiv-info">{infoData.class_id}</p>
                </div>
                <div>
                    <label>Time</label>
                    <p className="indiv-info">{infoData.time_expected}</p>
                </div>
                <div>
                    <label>Phone No.</label>
                    <p className="indiv-info">{infoData.phone_number}</p>
                </div>
            </div>
        </div>
    )
};
