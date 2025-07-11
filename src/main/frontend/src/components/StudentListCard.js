// external imports
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// internal imports
import Table from "./reusables/Table.js";
import { Controller, StudentController } from "../restAPI/entities.js";
import Popup from "./reusables/Popup.js";
import InputField from "./reusables/InputField.js";

export default function StudentListCard({ timeOfDay, dayOfWeek }) {
    // initializations
    // variables for input fields (popup form to create student)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [classId, setClassId] = useState("");
    const [day, setDay] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [timeExpected, setTimeExpected] = useState("");
    const [elementIds, setElementIds] = useState([]);

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
    const [editData, setEditData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    // variables for props passing
    const headers = ["Name", <button>Search</button>, "Payment Notes", "Notes", ""];

    const inputs1 = ["First Name", "Last Name", "Class ID", "Day", "Phone Number", "Time Expected"];
    const types1 = ["text", "text", "text", "text", "text", "text"];
    const vars1 = [firstName, lastName, classId, day, phoneNumber, timeExpected];
    const funcs1 = [setFirstName, setLastName, setClassId, setDay, setPhoneNumber, setTimeExpected];
    const placeholders = ["ex: Emma", "ex: Stone", "ex: LV1", "ex: Monday", "ex: 6471234567", "ex: 4 PM"];

    const inputs2 = ["First Name", "Last Name", "Payment Notes", "Notes"];
    const types2 = ["text", "text", "text", "text"];
    const vars2 = [newFirstName, newLastName, newPymtNotes, newNotes];
    const [studentValuesList, setStudentValuesList] = useState([]);
    const funcs2 = [setNewFirstName, setNewLastName, setNewPymtNotes, setNewNotes];

    useEffect(() => {
        if (editIndex !== null) {
            const jsxInputs = inputs2.map((element, ind) => (
                <td key={ind}>
                    <label className="css-label">{element}</label>
                    <InputField
                        type={types2[ind]}
                        value={vars2[ind]}
                        setter={funcs2[ind]}
                        cssName="css-student-input"
                    />
                </td>
            ));
            setEditData(jsxInputs);
        }
    }, [editIndex, newFirstName, newLastName, newPymtNotes, newNotes]); // runs AFTER all these are updated

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

        const elementIdList = studentList.map(({ student_id }) => {
            return [
                student_id
            ];
        })
        setElementIds(elementIdList);

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

    function handleEdit(index) {
        const [first, last, pymt, notes] = studentValuesList[index];
        setNewFirstName(first);
        setNewLastName(last);
        setNewPymtNotes(pymt !== null ? pymt : "");
        setNewNotes(notes !== null ? notes : "");

        setEditIndex(index);
    }

    // handleSave function for editing student
    async function handleSave(e, studentId) {
        // prevents browser from reloading page
        e.preventDefault();

        const student = await requests.getById(studentUrl, studentId[0]);

        const data = {
            student_id: studentId[0],
            first_name: newFirstName,
            last_name: newLastName,
            class_id: student.class_id,
            day: student.day,
            phone_number: student.phone_number,
            payment_notes: newPymtNotes,
            notes: newNotes,
            payment_number: student.payment_number,
            class_number: student.class_number,
            time_expected: student.time_expected
        };

        console.log(data);

        await requests.edit(studentUrl, data);

        console.log("save clicked");
        setEditIndex(null);
    }

    return (
        <div className="student-table">
            <p>{timeOfDay}</p>
            <Popup
                setGetOpen={[isOpen, setIsOpen]}
                setGetValid={[isValid, setIsValid]}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                buttonName="Create Student"
                inputFieldProps={[inputs1, types1, vars1, funcs1, placeholders]}
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
                elementIds={elementIds}
                refreshFunc={refreshStudents}
                headers={headers}
                handleSave={handleSave}
                handleEdit={handleEdit}
                editStates={[editIndex, setEditIndex]}
                editData={editData}
                cssName="css-student-input"
            />
        </div>
    )
};