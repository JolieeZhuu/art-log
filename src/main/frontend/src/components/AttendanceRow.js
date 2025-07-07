export default function AttendanceRow({ classNo, classDate, attdCheck, attdDate, checkIn, checkOut}) {
    return (
        <tr>
            <td>{classNo}</td>
            <td>{classDate}</td>
            <td>{attdCheck}</td>
            <td>{attdDate}</td>
            <td>{checkIn}</td>
            <td></td>
            <td>{checkOut}</td>
        </tr>
    )
};
