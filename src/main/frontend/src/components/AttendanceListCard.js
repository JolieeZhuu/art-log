// external imports
import { useState } from "react";

// internal imports
import AttendanceTable from "./AttendanceTable.js";
import { AttendanceController } from "../restAPI/entities.js";
import Table from "./reusables/Table.js";

export default function AttendanceListCard({ studentId, paymentNumber}) {
    // initializations
    const [data, setData] = useState([]);
    const attendanceUrl = "http://localhost:8080/attendance/";

    // variables for props passing
    const headers = ["Class No.", "Class Date", "Attd. Check", "Attd. Date", "Check In", "Makeup Mins", "Check Out", "Notes"];

    async function refreshAttendanceList() {
        const requests = new AttendanceController();
        const attendances = await requests.getByStudentIdAndPaymentNumber(attendanceUrl, studentId, paymentNumber);
        attendances.sort((a, b) => (a.class_number - b.class_number)); // a-b = lowest to highest, b-a = highest to lowest
        setData(attendances);
    }

    return (
        <div className="attendance-list-cards">
            <p>Payment Table {paymentNumber}</p>
            <AttendanceTable 
                className="attendance-table"
                data={data} 
                refreshAttendanceList={refreshAttendanceList}
            />
        </div>
    )
};
