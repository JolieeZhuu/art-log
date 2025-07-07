// external imports
import { useState, useCallback } from "react";

// internal imports
import StudentTable from "./StudentTable.js";
import Popup from "./reusables/Popup.js";
import { Controller, StudentController } from "../restAPI/entities.js";

export default function StudentListCard({ timeOfDay, dayOfWeek }) {
    // initializations
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [classId, setClassId] = useState("");
    const [day, setDay] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const requests = new Controller();
    const studentUrl = "http://localhost:8080/student/";
    const [data, setData] = useState([]);

    // variables for props passing
    const inputs = ["First Name", "Last Name", "Class ID", "Day", "Phone Number"];
    const types = ["text", "text", "text", "text", "text"];
    const vars = [firstName, lastName, classId, day, phoneNumber];
    const funcs = [setFirstName, setLastName, setClassId, setDay, setPhoneNumber];

    const refreshStudents = useCallback(async () => {
        const requests = new StudentController();
        let substring;
        if (timeOfDay === "Morning") {
            substring = "AM";
        } else {
            substring = "PM";
        }
        const studentList = await requests.getByDayAndExpectedTimeEnding(studentUrl, dayOfWeek, substring);
        setData(studentList);
    }, [dayOfWeek, timeOfDay]);

    async function handleSubmit(e) {
        // prevents browser from reloading page
        e.preventDefault();

        const data = {
            first_name: firstName,
            last_name: lastName,
            class_id: classId,
            day: day,
            phone_number: phoneNumber,
            payment_number: 0,
            class_number: 0,
            notes: 'Notes for ' + firstName,
            payment_notes: 'Payment notes for ' + firstName
        }

        requests.add(studentUrl, data)
        .then(() => {
            setFirstName("");
            setLastName("");
            setClassId("");
            setDay("")
            setPhoneNumber("");
        })
        setIsOpen(false);

        console.log("submitted");
    }

    return (
        <div className="student-table">
            <p>{timeOfDay}</p>
            <Popup
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                buttonName="Create Student"
                inputs={inputs}
                types={types}
                vars={vars}
                funcs={funcs}
                onSubmit={handleSubmit}
                submitButtonName="Create Student"
                cssName="css-create-student"
                formName="create-student-form"
                popupTitle="Create Student Form"
                popupDes="Fill in all the fields to create an art student."
            />
            <StudentTable data={data} refreshStudents={refreshStudents}/>
        </div>
    )
};
