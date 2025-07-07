import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Controller } from "../restAPI/entities.js";
import "../attendance.css";

export default function StudentInfo() {
    // for attendance list
    const location = useLocation();
    const studentUrl = 'http://localhost:8080/student/';
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [day, setDay] = useState('');
    const [classId, setClassId] = useState('');

    useEffect(() => {
        const controller = new Controller();
        controller.getById(studentUrl, location.state.student_id)
        .then((studentData) => {
            setFirstName(studentData.first_name);
            setLastName(studentData.last_name);
            setDay(studentData.day);
            setClassId(studentData.class_id);
        })
    }, [location.state.student_id]);

    return (
        <div>
            <h1 className="info-header">{firstName} {lastName}</h1>
            <div className="info-container">
                <div className="info">{day}</div>
                <div className="info">{classId}</div>
            </div>
        </div>
    )
}