// external imports
import { useEffect } from "react";

// internal imports
import AttendanceRow from "./AttendanceRow.js";

export default function AttendanceTable({ data, refreshAttendanceList }) {

    useEffect(() => {
        refreshAttendanceList();
    }, [refreshAttendanceList])

    return (
        <div>
            <table className="scrollable-table">
                <thead>
                    <tr>
                        <th>Class No.</th>
                        <th>Class Date</th>
                        <th>Attd. Check</th>
                        <th>Attd. Date</th>
                        <th>Check In</th>
                        <th>Makeup Mins</th>
                        <th>Check Out</th>
                        <th>Notes</th>
                    </tr>
                </thead>
            </table>
            <div className="attendance-table-wrapper">
                <table className="scrollable-table">
                    <tbody>
                        {
                            data.map((attendance, index) => {
                                return (
                                    <AttendanceRow
                                        key={index}
                                        classNo={attendance.class_number}
                                        classDate={attendance.date_expected}
                                        attdCheck={attendance.attendance_check}
                                        attdDate={attendance.date_attended}
                                        checkIn={attendance.check_in}
                                        checkOut={attendance.check_out}
                                    />
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
};
