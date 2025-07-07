import { React, useState, useEffect, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

import { RiArrowDropDownLine } from "react-icons/ri";

import { Controller } from "../../restAPI/entities.js";
import NewPayment from "../NewPayment.js";
import dayjs from 'dayjs';
import "../attendance.css";

export default function AttendanceList() {
    const location = useLocation();
    const attendanceUrl = 'http://localhost:8080/attendance/';
    const studentUrl = 'http://localhost:8080/student/';
    const [data, setData] = useState([]);
    const requests = new Controller();

    const [edit, setEdit] = useState(false);
    const [idEdit, setIdEdit] = useState(null);
    
    const [newDateAttended, setNewDateAttended] = useState('');
    const [newCheckIn, setNewCheckIn] = useState('');
    const [newHours, setNewHours] = useState('');

    // for list box
    const attendanceCheck = [
        {
            id: 1,
            option: 'Yes'
        },
        {
            id: 2,
            option: 'Absent'
        },
        {
            id: 3,
            option: 'Makeup'
        },
        {
            id: 4,
            option: 'Holiday'
        }
    ];

    const [selectedOption, setSelectedOption] = useState();

    const refreshAttendances = useCallback(async () => {
        const myAttendance = [];
        const controller = new Controller();

        // Wait to collect student payment number
        const student = await controller.getById(studentUrl, location.state.student_id);
        const myPaymentNumber = student.payment_number;

        // Wait to collect all attendance data
        const attendanceData = await controller.getAll(attendanceUrl);

        // Filter and sort attendance data
        attendanceData.forEach((attendance) => {
            if (attendance.student_id === location.state.student_id && attendance.payment_number === myPaymentNumber) {
                myAttendance.push(attendance);
            }
        });

        myAttendance.sort((a, b) => a.class_number - b.class_number);
        
        // Update state
        setData(myAttendance);
        console.log('hello'); // DEBUG TO TEST RENDERING
    }, [location.state.student_id]);

    useEffect(() => {
        refreshAttendances();
    }, [refreshAttendances]);

    function editButton(id, attendance) {
        setEdit(true);
        setIdEdit(id);

        const foundOption = attendanceCheck.find(choice => choice.option === attendance.attendance_check);
        setSelectedOption(foundOption || {id: 5, option: ''}); // if foundOption not found, set to empty string

        setNewDateAttended(dayjs(attendance.date_attended).format('YYYY-MM-DD'));
        setNewCheckIn(attendance.check_in);
        setNewHours(attendance.hours);
    }

    async function editAttendance(id, attendance) {
        const formatDateAttended = newDateAttended === 'Invalid Date' ? '' : dayjs(newDateAttended).format('MMM D YYYY');
        const date = dayjs().format('MMM D YYYY');
        const ampm = dayjs().format('A');
        console.log('here');
        console.log(newCheckIn);
        const formatCheckIn = newCheckIn === '' || newCheckIn === 'Invalid Date' || newCheckIn === null ? '' : dayjs(date + " " + newCheckIn + " " + ampm).format('hh:mm A');
        const newCheckOut = newCheckIn === '' || newCheckIn === 'Invalid Date' || newCheckIn === null ? '' : dayjs(date + " " + newCheckIn + " " + ampm).add(newHours, 'hours').format('hh:mm A');

        const data = {
            attendance_id: id,
            student_id: attendance.student_id,
            payment_number: attendance.payment_number,
            class_number: attendance.class_number,
            date_expected: attendance.date_expected,
            attendance_check: selectedOption.option,
            date_attended: formatDateAttended,
            check_in: formatCheckIn,
            hours: newHours,
            check_out: newCheckOut
        }
        console.log(data.attendance_check);
        requests.edit(attendanceUrl, data);
        if (data.attendance_check === 'Holiday') {
            await addClassWhenHoliday(attendance.student_id, attendance.payment_number);
        }
        setTimeout(() => {
            refreshAttendances(); 
        }, 100);
        setEdit(false);
    }

    async function addClassWhenHoliday(studentId, paymentNum) {
        const allAttendances = await requests.getAll(attendanceUrl);
        let largestClassNum = 0;
        let latestClassDate = '';
        allAttendances.forEach((attendance) => {
            if (attendance.student_id === studentId && attendance.payment_number === paymentNum) {
                if (attendance.class_number > largestClassNum) {
                    largestClassNum = attendance.class_number;
                    latestClassDate = attendance.date_expected;
                }
            }
        })
        const data = {
            student_id: studentId,
            payment_number: paymentNum,
            class_number: largestClassNum+1,
            date_expected: dayjs(latestClassDate).add(7, 'days').format('MMM D, YYYY'),
            hours: 1
        }
        await requests.add(attendanceUrl, data);
    }

    return (
        <div className="rectangle">
            <h1 className="student-headers">Payment Table</h1>
            <table className="student-table">
                <thead>
                    <tr>
                        <th>
                            <NewPayment refreshAttendances={refreshAttendances}></NewPayment>
                        </th>
                        <th>Class Date</th>
                        <th>Attendance Check</th>
                        <th>Attended Date</th>
                        <th>Check In</th>
                        <th>Hours</th>
                        <th>Check Out</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((attendance, index) => {
                        return (
                            <tr key={attendance.attendance_id}>
                                { edit && idEdit === attendance.attendance_id ? (
                                    <>
                                        <td>{attendance.class_number}</td>
                                        <td>{attendance.date_expected}</td>
                                        <td>
                                            <Listbox value={selectedOption} onChange={setSelectedOption}>
                                            <ListboxButton className="listbox-button">
                                                    {selectedOption.option}
                                                    <RiArrowDropDownLine/>
                                            </ListboxButton>
                                                <ListboxOptions className="listbox-options" data-headlessui-state="leave" anchor="bottom">
                                                    {attendanceCheck.map((choice) => (
                                                        <ListboxOption className="listbox-option text-sm" key={choice.id} value={choice}>
                                                            <div data-focus>
                                                                {choice.option}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </Listbox>
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                name="newDateAttended"
                                                placeholder={attendance.date_attended}
                                                value={newDateAttended} 
                                                onChange={e => setNewDateAttended(e.target.value)} />
                                        </td>
                                        <td>
                                            <input 
                                                name="newCheckIn"
                                                placeholder={attendance.check_in}
                                                value={newCheckIn} 
                                                onChange={e => setNewCheckIn(e.target.value)} />
                                        </td>
                                        <td>
                                            <input 
                                                name="newHours"
                                                placeholder={attendance.hours}
                                                value={newHours} 
                                                onChange={e => setNewHours(e.target.value)} />
                                        </td>
                                        <td>{attendance.check_out}</td>
                                        <td>
                                            <button className="btn" onClick={() => {editAttendance(attendance.attendance_id, attendance)}}>S</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{attendance.class_number}</td>
                                        <td>{attendance.date_expected}</td>
                                        <td>{attendance.attendance_check}</td>
                                        <td>{attendance.date_attended}</td>
                                        <td>{attendance.check_in}</td>
                                        <td>{attendance.hours}</td>
                                        <td>{attendance.check_out}</td>
                                        <td>
                                            <button className="btn" onClick={() => {editButton(attendance.attendance_id, attendance)}}>E</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}