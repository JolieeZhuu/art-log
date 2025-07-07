import { React, useState } from "react";
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Controller } from "../restAPI/entities.js";

export default function DeleteStudent({ studentId, filterIndex, refreshStudents }) {
    const [isOpen, setIsOpen] = useState(false);
    const requests = new Controller();
    const attendanceUrl = 'http://localhost:8080/attendance/';
    const studentUrl = 'http://localhost:8080/student/';

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        requests.getAll(attendanceUrl)
        .then((attendances) => {
            attendances.forEach((attendance) => {
                if (attendance.student_id === studentId)
                    requests.deleteById(attendanceUrl, attendance.attendance_id);
            })

            requests.deleteById(studentUrl, studentId)
            .then(() => {
                refreshStudents(filterIndex);
            });
        })
        setIsOpen(false);  
    }

    return (
        <div>
            {
                /*
                * code below from the headlessui 
                */
            }
            <button onClick={() => setIsOpen(true)} className="btn">D</button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="dialog-container">
                <DialogBackdrop className="panel-bg" />
                <div className="dialog-overlay">
                    <DialogPanel className="dialog-panel">
                        <DialogTitle className="dialog-title">Delete Student</DialogTitle>
                        <Description>Are you sure you want to delete this student? All attendance data will be deleted as well. </Description>
                        <form onSubmit={handleSubmit}>
                            <div className="form">
                                <button className="btn" type="submit">Delete</button>
                            </div>
                            {
                                /*
                                <div className="button-group">
                                    <button onClick={() => setIsOpen(false)} className="btn">Cancel</button>
                                    <button type="submit" onClick={() => setIsOpen(false)} className="btn danger">Create</button>
                                </div>
                                */
                            }
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}