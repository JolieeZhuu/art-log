// external imports
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// internal imports
import InputField from "./reusables/InputField";
import { Controller } from "../restAPI/entities";

export default function StudentRow({ id, fName, lName, pNotes, gNotes, day}) {
    // initializations
    const [isHovering, setIsHovering] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const rowRef = useRef(null);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(fName !== null ? fName : "");
    const [lastName, setLastName] = useState(lName !== null ? lName : "");
    const [pymtNotes, setPymtNotes] = useState(pNotes !== null ? pNotes : "");
    const [notes, setNotes] = useState(gNotes !== null ? gNotes : "");

    const inputs = ["First name", "Last name", "Payment notes", "Notes"];
    const types = ["text", "text", "text", "text"];
    const vars = [firstName, lastName, pymtNotes, notes];
    const funcs = [setFirstName, setLastName, setPymtNotes, setNotes];

    // CHAT GPT WRITTEN, UNDERSTAND WHY!!!!
    useEffect(() => {
        function handleClickOutside(event) {
            if (editMode && rowRef.current && !rowRef.current.contains(event.target)) {
                setEditMode(false); // exit edit mode
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editMode]);

    function handleMouseEnter() {
        setIsHovering(true);
    }

    function handleMouseLeave() {
        setIsHovering(false);
    }

    function editStudent() {
        setEditMode(true);
    }

    function toStudentDatabase() {
        navigate(`/${day.toLowerCase()}/student-database/${id}`);
    }

    async function handleSubmit(e) {
        // initializations
        const studentUrl = "http://localhost:8080/student/";
        const requests = new Controller();
        const indivStudent = await requests.getById(studentUrl, id);
        const data = {
            student_id: id,
            first_name: firstName,
            last_name: lastName,
            class_id: indivStudent.class_id,
            day: indivStudent.day,
            phone_number: indivStudent.phone_number,
            payment_number: indivStudent.payment_number,
            class_number: indivStudent.class_number,
            payment_notes: pymtNotes,
            notes: notes,
            time_expected: indivStudent.time_expected
        }

        requests.edit(studentUrl, data);

        // prevents browser from reloading page
        e.preventDefault();
        setEditMode(false);
        setIsHovering(false);
    }

    return (
        <tr ref={rowRef} className="student-table-row" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {
                editMode ? (
                    <>
                        {
                            inputs.map((element, index) => {
                                return (
                                    <td key={index}>
                                        <InputField 
                                            type={types[index]} 
                                            placeholder={vars[index]} 
                                            value={vars[index]} 
                                            setter={funcs[index]} 
                                            cssName="css-student-input"
                                        />
                                    </td>
                                )
                            })
                        }
                        <td>
                            <button onClick={handleSubmit}>Save</button>
                        </td>
                    </>                    
                ) : (
                    <>
                        <td>
                            <input type="checkbox"/>
                        </td>
                        <td>
                            <button onClick={toStudentDatabase}>{firstName} {lastName}</button>
                        </td>
                        <td>{pymtNotes}</td>
                        <td>{notes}</td>
                        <td>
                            {
                                isHovering ? (
                                    <button onClick={editStudent}>Edit</button>
                                ) : (
                                    <></>
                                )
                            }
                        </td>
                    </>
                )
            }
        </tr>
    )
};
