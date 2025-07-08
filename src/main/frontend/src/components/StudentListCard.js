// external imports
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// internal imports
import Table from "./reusables/Table.js";
import { Controller, StudentController } from "../restAPI/entities.js";
import Popup from "./reusables/Popup.js";

export default function StudentListCard({ timeOfDay, dayOfWeek }) {
    // initializations
    // variables for input fields (popup form to create student)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [classId, setClassId] = useState("");
    const [day, setDay] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [timeExpected, setTimeExpected] = useState("");

    // variables for input fields (edit form to edit student)
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newPymtNotes, setNewPymtNotes] = useState("");
    const [newNotes, setNewNotes] = useState("");

    // variables for this component
    const requests = new Controller();
    const studentUrl = "http://localhost:8080/student/";
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(true);

    // variables for props passing
    const headers = ["Name", <button>Search</button>, "Pymnt. Notes", "Notes", ""];

    const inputs1 = ["First Name", "Last Name", "Class ID", "Day", "Phone Number", "Time Expected [# AM/PM]"];
    const types1 = ["text", "text", "text", "text", "text", "text"];
    const vars1 = [firstName, lastName, classId, day, phoneNumber, timeExpected];
    const funcs1 = [setFirstName, setLastName, setClassId, setDay, setPhoneNumber, setTimeExpected];

    const inputs2 = ["First Name", "Last Name", "Payment Notes", "Notes"];
    const types2 = ["text", "text", "text", "text"];
    const vars2 = [newFirstName, newLastName, newPymtNotes, newNotes];
    const [studentValuesList, setStudentValuesList] = useState([]);
    const funcs2 = [setNewFirstName, setNewLastName, setNewPymtNotes, setNewNotes];

    // callback async function to be used in Table (for Students)
    const refreshStudents = useCallback(async () => {
        // initializations
        const requests = new StudentController();
        let substring;

        function toStudentDatabase(day, id) {
            navigate(`/${day.toLowerCase()}/student-database/${id}`);
        }

        if (timeOfDay === "Morning") {
            substring = "AM";
        } else {
            substring = "PM";
        }
        const studentList = await requests.getByDayAndExpectedTimeEnding(studentUrl, dayOfWeek, substring);

        // store values to be used during editMode
        const studentValuesList = studentList.map(({ first_name, last_name, payment_notes, notes }) => {
            return [first_name, last_name, payment_notes, notes];
        })
        setStudentValuesList(studentValuesList);

        // reduced list that will act as the display in JSX
        const reducedStudentList = studentList.map(({ student_id, first_name, last_name, day, payment_notes, notes }) => {
            return [
                <input key={student_id} type="checkbox"/>,
                <button key={student_id} onClick={() => toStudentDatabase(day, student_id)}>{first_name} {last_name}</button>,
                payment_notes,
                notes
            ];
        })
        setData(reducedStudentList);
    }, [dayOfWeek, timeOfDay, navigate]);

    // handleSubmit function for popup form
    async function handleSubmit(e) {
        // prevents browser from reloading page
        e.preventDefault();

        let isInputValid = true; // local variable since isValid will still be true despite setter
        vars1.forEach(element => {
            if (element === null || element === "" || element === "Invalid Date") {
                isInputValid = false;
            }
        })
        setIsValid(isInputValid);

        if (isInputValid) {
            const data = {
                first_name: firstName,
                last_name: lastName,
                class_id: classId,
                day: day,
                phone_number: phoneNumber,
                payment_number: 0,
                class_number: 0,
                notes: 'Notes for ' + firstName,
                payment_notes: 'Payment notes for ' + firstName,
                time_expected: timeExpected
            }

            requests.add(studentUrl, data)
            .then(() => {
                setFirstName("");
                setLastName("");
                setClassId("");
                setDay("")
                setPhoneNumber("");
                setTimeExpected("");
            })
            setIsOpen(false);
        }
    }

    function handleEdit(index, setEditMode) {
        const [first, last, pymt, notes] = studentValuesList[index];
        setNewFirstName(first);
        setNewLastName(last);
        setNewPymtNotes(pymt !== null ? pymt : "Pymt. Notes");
        setNewNotes(notes !== null ? notes : "Notes");

        setEditMode(true)
    }

    // handleSave function for editing student
    function handleSave(e, setEditMode) {
        console.log("save clicked");
        setEditMode(false);
    }

    return (
        <div className="student-table">
            <p>{timeOfDay}</p>
            <Popup
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                buttonName="Create Student"
                inputs={inputs1}
                types={types1}
                vars={vars1}
                funcs={funcs1}
                onSubmit={handleSubmit}
                submitButtonName="Create Student"
                cssName="css-create-student"
                formName="create-student-form"
                popupTitle="Create Student Form"
                popupDes="Fill in all the fields to create an art student."
                validVar = {isValid}
                validFunc = {setIsValid}
            />
            <Table
                data={data}
                refreshFunc={refreshStudents}
                headers={headers}
                handleSave={handleSave}
                handleEdit={handleEdit}
                inputFieldProps={[inputs2, types2, vars2, funcs2]}
                cssName="css-student-input"
            />
        </div>
    )
};
