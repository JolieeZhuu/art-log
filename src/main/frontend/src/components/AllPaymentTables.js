// external imports
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// internal imports
import AttendanceListCard from "./AttendanceListCard.js";
import { getPaymentNum } from "../functions/paymentFuncs.js";
import Navigation from "./reusables/Navigation.js";
import { Controller } from "../restAPI/entities.js";

export default function AllPaymentTables() {
    // initializations
    const { id, day } = useParams(); // deconstruct object to separate id
    const [cardList, setCardList] = useState([]);
    const [studentName, setStudentName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function loadAttendanceCards() {
            const num = await getPaymentNum(id);
            const cards = Array.from({length: num}).map((_, index) => {
                return (
                    <AttendanceListCard 
                        key={index}
                        studentId={id}
                        paymentNumber={num - index}
                    />
                )
            })
            setCardList(cards);
        }
        loadAttendanceCards();

        async function getStudentName() {
            const requests = new Controller();
            const studentUrl = "http://localhost:8080/student/";
            const student = await requests.getById(studentUrl, id);
            setStudentName(student.first_name + " " + student.last_name);
        }       
        getStudentName(); 
    })

    function backToStudentDB() {
        navigate(`/${day}/student-database/${id}`);
    }

    return (
        <div className="navbar-page">
            <Navigation/>
            <div>
                <h2 className="header">All Payment Tables of {studentName}</h2>
                <button onClick={backToStudentDB}>Back to {studentName}</button>
                <button>Search</button>
                {cardList}
            </div>
        </div>
    )
};
