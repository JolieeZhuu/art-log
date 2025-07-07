import { React, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Controller } from "../../restAPI/entities.js";
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import dayjs from 'dayjs';
import '../index.css';
import '../popup.css';

export default function NewPayment({ refreshAttendances }) {

    const [dateExpected, setDateExpected] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const attendanceUrl = 'http://localhost:8080/attendance/';
    const studentUrl = 'http://localhost:8080/student/';
    const requests = new Controller();

    const [isValid, setIsValid] = useState(true);
    
    async function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        const firstClassDate = dayjs(dateExpected).format('MMM D, YYYY'); // Jan 1, 2025
        console.log(firstClassDate);
        if (firstClassDate === 'Invalid Date' || firstClassDate === null || firstClassDate === '') {
            setIsValid(false);
        } else {
            setIsValid(true);
            const currentPaymentNum = await getStudentPaymentNum();
    
            const data = {
                student_id: location.state.student_id,
                class_number: 1,
                date_expected: firstClassDate,
                date_attended: null,
                check_in: null,
                hours: 1,
                check_out: null,
                payment_number: currentPaymentNum
            }
    
            await requests.add(attendanceUrl, data)
            await generateClasses(firstClassDate, currentPaymentNum);
            await refreshAttendances();
    
            setDateExpected("");
            setIsOpen(false);
        }
    }

    async function getStudentPaymentNum() {
        const student = await requests.getById(studentUrl, location.state.student_id);
        const currentPaymentNum = student.payment_number + 1;
        
        const data = {
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            class_id: student.class_id,
            day: student.day,
            phone_number: student.phone_number,
            payment_number: currentPaymentNum,
            class_number: 0,
            notes: student.notes,
            payment_notes: student.payment_notes
        }

        requests.edit(studentUrl, data);
        return currentPaymentNum;
    }

    async function generateClasses(firstClassDate, currentPaymentNum) {
        for (let i = 2; i <= 10; i++) {
            const nextClassDate = dayjs(firstClassDate).add(7*(i-1), 'days').format('MMM D, YYYY');
            const data = {
                student_id: location.state.student_id,
                class_number: i,
                date_expected: nextClassDate,
                date_attended: null,
                check_in: null,
                hours: 1,
                check_out: null,
                payment_number: currentPaymentNum
            }

            await requests.add(attendanceUrl, data)
        }
    }

    return (
        <div>
            {
                /*
                * code below from the headlessui 
                */
            }
            <button onClick={() => setIsOpen(true)} className="btn">New Payment</button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="dialog-container">
                <DialogBackdrop className="panel-bg" />
                <div className="dialog-overlay">
                    <DialogPanel className="dialog-panel">
                        <DialogTitle className="dialog-title">Add new payment</DialogTitle>
                        <Description>Please make sure to input values for all required</Description>
                        <form onSubmit={handleSubmit}>
                            <div className="form">
                                <input type="date" name="dateExpected" value={dateExpected} onChange={e => setDateExpected(e.target.value)}/>
                                {!isValid && (
                                    <p className="warning-message">Please input a valid date.</p>
                                )}
                                <button className="btn" type="submit">Create</button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>            
        </div>
    )
}