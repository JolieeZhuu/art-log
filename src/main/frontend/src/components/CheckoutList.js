import { React } from "react";
import "../checkoutlist.css";

export default function CheckoutList({ checkedState, students }) {
    const checkedStudentList = Array.from(checkedState.entries())
        .filter(([studentId, [checked]]) => checked) // Filter checked students
        .map(([studentId, [checked, checkInTime, checkOutTime, classId]]) => {
            const student = students.find(s => s.student_id === studentId);
            return student ? { ...student, checkInTime, checkOutTime, classId } : null;
        })
        .filter(student => student !== null);


    return (
        <div className="rectangle">
            <h1 className="student-headers">Checkout List</h1>
            <table className="checkout-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Check Out Time</th>
                        <th>Class ID</th>
                        <th>Check In Time</th>
                    </tr>
                </thead>
                <tbody>
                    { checkedStudentList.length === 0 ? (
                        <tr>
                            <td>No students yet</td>
                        </tr>
                    ) : (
                        <>
                            { checkedStudentList.map((student) => (
                                <tr key={student.student_id}>
                                    <td>{student.first_name} {student.last_name}</td>
                                    <td>{student.checkOutTime}</td>
                                    <td>{student.classId}</td>
                                    <td>{student.checkInTime}</td>
                                </tr>
                            ))}
                        </>
                    )}
                    
                </tbody>
            </table>
        </div>
    )
}