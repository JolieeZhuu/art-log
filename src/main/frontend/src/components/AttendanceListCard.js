// external imports
import { useState, useCallback, useEffect } from "react";

// internal imports
import { AttendanceController } from "../restAPI/entities.js";
import Table from "./reusables/Table.js";
import InputField from "./reusables/InputField.js";

export default function AttendanceListCard({ studentId, paymentNumber}) {
    // initializations
    const [data, setData] = useState([]);
    const attendanceUrl = "http://localhost:8080/attendance/";
    const [elementIds, setElementIds] = useState([]);
    const [editData, setEditData] = useState([]);
    const [editMode, setEditMode] = useState(false);

    // variables for input fields
    const [attendanceValuesList, setAttendanceValuesList] = useState([]);

    const [dateExpected, setDateExpected] = useState("");
    const [attendanceCheck, setAttendanceCheck] = useState("");
    const [dateAttended, setDateAttended] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [makeupMins, setMakeupMins] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [notes, setNotes] = useState("");

    // variables for props passing
    const headers = ["Class No.", "Class Date", "Attd. Check", "Attd. Date", "Check In", "Makeup Mins", "Check Out", "Notes", ""];

    const inputs = ["Class Date", "Attd. Check", "Attd. Date", "Check In", "Makeup Mins", "Check Out", "Notes"];
    const types = ["date", "text", "date", "text", "text", "text", "text"];
    const vars = [dateExpected, attendanceCheck, dateAttended, checkIn, makeupMins, checkOut, notes];
    const funcs = [setDateExpected, setAttendanceCheck, setDateAttended, setCheckIn, setMakeupMins, setCheckOut, setNotes];

    useEffect(() => {
        if (editMode) {
            const jsxInputs = inputs.map((element, ind) => (
                <td key={ind}>
                    <label className="css-label">{element}</label>
                    <InputField
                        type={types[ind]}
                        value={vars[ind]}
                        setter={funcs[ind]}
                        cssName="css-student-input"
                    />
                </td>
            ));
            setEditData(jsxInputs);
        }
    }, [editMode, dateExpected, attendanceCheck, dateAttended, checkIn, makeupMins, checkOut, notes]); // runs AFTER all these are updated

    const refreshAttendanceList = useCallback(async () => {
        const requests = new AttendanceController();
        const attendances = await requests.getByStudentIdAndPaymentNumber(attendanceUrl, studentId, paymentNumber);
        attendances.sort((a, b) => (a.class_number - b.class_number)); // a-b = lowest to highest, b-a = highest to lowest

        // variable to initialize the input fields
        const attendancesList = attendances.map(({ date_expected, attendance_check, date_attended, check_in, check_out}) => {
            return [
                date_expected, attendance_check, date_attended, check_in, check_out
            ]
        })
        setAttendanceValuesList(attendancesList);

        const elementIdList = attendances.map(({ attendance_id }) => {
            return [
                attendance_id
            ];
        })
        setElementIds(elementIdList);

        // variable to store JSX code
        const jsxAttendances = attendances.map(({ class_number, date_expected, date_attended, attendance_check, check_in, check_out}) => {
            return [
                class_number, date_expected, attendance_check, date_attended, check_in, "", check_out, ""
            ];
        })

        setData(jsxAttendances);
    }, [studentId, paymentNumber])

    function handleEdit(index) {
        const [classDate, attdCheck, attdDate, inC, outC] = attendanceValuesList[index];
        setDateExpected(classDate);
        setAttendanceCheck(attdCheck);
        setDateAttended(attdDate);
        setCheckIn(inC);
        setMakeupMins("Makeup Mins");
        setCheckOut(outC);
        setNotes("Notes");

        setEditMode(true);
    }

    function handleSave(e) {
        console.log("save clicked");
        setEditMode(false);
    }

    return (
        <div className="attendance-list-cards">
            <p>Payment Table {paymentNumber}</p>
            <Table
                data={data}
                elementIds={elementIds}
                refreshFunc={refreshAttendanceList}
                headers={headers}
                handleSave={handleSave}
                handleEdit={handleEdit}
                editStates={[editMode, setEditMode]}
                editData={editData}
                inputFieldProps={[inputs, types, vars, funcs]}
                cssName="css-student-input"
            />
        </div>
    )
};