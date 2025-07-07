// external imports
import { useState, useCallback, useEffect } from "react";

// internal imports
import { Controller } from "../restAPI/entities";

export default function StudentDBInfo({ id, cssIDName, day }) {
    // initializations
    const [infoData, setInfoData] = useState([]);
    const studentUrl = "http://localhost:8080/student/";

    const refreshStudentInfo = useCallback(async () => {
        const requests = new Controller();
        const studentInfo = await requests.getById(studentUrl, id);
        setInfoData(studentInfo);
    }, [id])

    useEffect(() => {
        refreshStudentInfo();
    }, [refreshStudentInfo])

    return (
        <div>
            <div className="header">
                <h2>{infoData.first_name} {infoData.last_name}</h2>
                <button>
                    <a href={cssIDName}>
                        Back to {day}
                    </a>
                </button>
            </div>
            
            <div className="css-student-info">
                <p className="indiv-info">{infoData.day}</p>
                <p className="indiv-info">{infoData.class_id}</p>
                <p className="indiv-info">{infoData.time_expected}</p>
            </div>
        </div>
    )
};
