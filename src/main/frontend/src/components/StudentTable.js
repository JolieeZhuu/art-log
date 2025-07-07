// external imports
import { useEffect } from "react";

// internal imports
import StudentRow from "./StudentRow";

export default function StudentTable({ data, refreshStudents }) {

    // separate useEffect functions for different changes
    useEffect(() => {
        refreshStudents();
    }, [refreshStudents]); // only updates when getStudents changes

    return (
        <div>
            <table className="scrollable-table">
                <colgroup>
                    <col style={{width: "38px"}}/>
                    <col style={{width: "30px"}}/>
                    <col style={{width: "53px"}}/>
                    <col style={{width: "53px"}}/>
                    <col style={{width: "24px"}}/>
                </colgroup>
                <thead>
                    <tr>   
                        <th>Name</th>
                        <th>
                            <button>Search</button>
                        </th>
                        <th>Pymt. Notes</th>
                        <th>Notes</th>
                        <th></th>
                    </tr>
                </thead>
            </table>
            <div className="student-table-wrapper">
                <table className="scrollable-table">
                    <colgroup>
                        <col style={{width: "10px"}}/>
                        <col style={{width: "60px"}}/>
                        <col style={{width: "55px"}}/>
                        <col style={{width: "55px"}}/>
                        <col style={{width: "20px"}}/>
                    </colgroup>
                    <tbody>
                        {
                            data.map((student, index) => {
                                return (
                                    <StudentRow
                                        key={index}
                                        id={student.student_id}
                                        fName={student.first_name}
                                        lName={student.last_name}
                                        pNotes={student.payment_notes}
                                        gNotes={student.notes}
                                        day={student.day}
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
