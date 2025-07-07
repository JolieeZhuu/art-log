import { React, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Controller } from "../../restAPI/entities.js";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IconContext } from "react-icons";

import StudentForm from "./StudentForm.js";
import DeleteStudent from "../DeleteStudent.js";
import CheckoutList from "../CheckoutList.js";
import dayjs from 'dayjs';
import "../studentlist.css"

export default function StudentList() {
    // api request initializations
    const studentUrl = 'http://localhost:8080/student/';
    const attendanceUrl = 'http://localhost:8080/attendance/';
    const navigate = useNavigate();
    const requests = new Controller();

    // filter initialization
    const dayOfWeek = dayjs().format('dddd');
    const filters = useMemo(() =>["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Unfilter"]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [data, setData] = useState([]);
    const [filterIndex, setFilterIndex] = useState(filters.indexOf(dayOfWeek));

    // edit student initialization
    const [edit, setEdit] = useState(false);
    const [idEdit, setIdEdit] = useState(null);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newPaymentNotes, setNewPaymentNotes] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [newClassId, setNewClassId] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    // checkmark initialization
    const [checkedState, setCheckedState] = useState(new Map()) // initialization of checkedState is empty at first; KEY VALUE???
    const isInitialRender = useRef(true); // track initial render

    // list box initialization
    const daysOfWeek = [
        {id: 1, day: 'Sunday'},
        {id: 2, day: 'Monday'},
        {id: 3, day: "Tuesday"},
        {id: 4, day: "Wednesday"},
        {id: 5, day: "Thursday"},
        {id: 6, day: "Friday"},
        {id: 7, day: "Saturday"}
    ];
    const [selectedOption, setSelectedOption] = useState(daysOfWeek[0]);
    
    // page rendering functions
    // useEffect is used to ensure page renders only when dependencies are changed
    const checkTime = useCallback(async () => {
        const currentHour = dayjs().format("H"); // 24 hour clock, String
        const currentMins = dayjs().format("m");
        console.log(currentHour);
        console.log(currentMins);
        if (currentHour > "18") {
            setCheckedState(new Map());
            localStorage.setItem("checkedState", JSON.stringify(Array.from(checkedState.entries()))); // convert to array
            markAsAbsent(); // uncheck all boxes
        }
    }, [])

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("checkedState")) || [];
        const newMap = new Map();

        if (Array.isArray(savedState)) { // check if savedState is an array
            savedState.forEach((item) => {
                if (Array.isArray(item) && item.length === 2 && Array.isArray(item[1])) {
                    const [studentId, [checked, checkIn, checkOut, classId]] = item;
                    newMap.set(studentId, [checked, checkIn, checkOut, classId]);
                }
            });
        }
        setCheckedState(newMap);
        
        const intervalId = setInterval(checkTime, 1000 * 60); // check every minute
        return () => clearInterval(intervalId);
    }, [checkTime]);

    const refreshStudents = useCallback(async (index) => {
        const controller = new Controller();
        const studentData = await controller.getAll(studentUrl);
        let filteredData;
    
        // filtering data based on button clicked
        if (index === 7) {
            filteredData = studentData;
        } else {
            filteredData = studentData.filter((student) => student.day === filters[index]);
        }
        filteredData.sort((a, b) => a.first_name.localeCompare(b.first_name));

        setData(filteredData);
        setActiveFilter(index); // filter students

        const updatedCheckedState = new Map(checkedState);

        filteredData.forEach((student) => {
            if(!updatedCheckedState.has(student.student_id)) { // if student does not exist in checkedState
                updatedCheckedState.set(student.student_id, [false, '', '', '']);
            }
        })
        setCheckedState(updatedCheckedState);
    }, [filters, studentUrl, checkedState]);


    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            refreshStudents(filterIndex);
            return;
        }
        if (filterIndex !== activeFilter) {
            refreshStudents(filterIndex);
        }
    }, [filterIndex, activeFilter, refreshStudents]); // only re-renders when filterIndex, activeFilter, or refreshStudents is changed

    // navigation function (when arrow button is clicked)
    function toAttendancePage(studentId) {
        navigate(`/attendance`,
            {
                state: {
                    student_id: studentId
                }
            }
        );
    }

    function editButton(id, student) {
        setEdit(true); // make editing form visible
        setIdEdit(id);

        // defaults set to current student information
        setNewFirstName(student.first_name);
        setNewLastName(student.last_name);
        setNewPaymentNotes(student.payment_notes);
        setNewNotes(student.notes);
        setNewClassId(student.class_id);
        const foundOption = daysOfWeek.find(option => option.day === student.day);
        setSelectedOption(foundOption || {id: 5, option: ''}); // Set to empty string if not found.
        setNewPhoneNumber(student.phone_number);
    }

    async function editStudent(studentId, paymentNumber, classNumber) {
        const data = {
            student_id: studentId,
            first_name: newFirstName,
            last_name: newLastName,
            class_id: newClassId,
            day: selectedOption.day,
            phone_number: newPhoneNumber,
            payment_number: paymentNumber,
            class_number: classNumber,
            notes: newNotes,
            payment_notes: newPaymentNotes
        }
        requests.edit(studentUrl, data);
        setTimeout(() => {
            refreshStudents(filterIndex); // delayed in case editing hasn't completed
        }, 500);
        setEdit(false);
    }

    async function markAsAbsent() {
        const allStudents = await requests.getAll(studentUrl);
        const allAttendances = await requests.getAll(attendanceUrl);
        const currentDate = dayjs().format('MMM D, YYYY');
        const currentDayOfWeek = dayjs().format('dddd');

        // filtering out until only the attendances without 'Yes' are gotten
        const selectStudents = allStudents.filter((student) => {
            return student.day === currentDayOfWeek;
        })
        const selectAttendances = allAttendances.filter((attendance) => {
            return (selectStudents.some((student) => student.student_id === attendance.student_id)
                && attendance.date_expected === currentDate);
        })

        selectAttendances.forEach((attendance) => {
            if (attendance.attendance_check !== 'Yes') {
                const data = {
                    attendance_id: attendance.attendance_id,
                    student_id: attendance.student_id,
                    payment_number: attendance.payment_number,
                    class_number: attendance.class_number,
                    date_expected: attendance.date_expected,
                    attendance_check: 'Absent',
                    hours: 1
                }
                requests.edit(attendanceUrl, data);
            }
        })
    }

    async function fetchMyAttendances(studentId, paymentNum) {
        const allAttendances = await requests.getAll(attendanceUrl);
        const myAttendances = [];
        allAttendances.forEach((attendance) => {
            if (attendance.student_id === studentId && attendance.paymentNum === paymentNum) {
                myAttendances.push(attendance)
            }
        }) 
        return myAttendances;
    }

    function checkMatchingDates(myAttendances, currentDate) { // given student
        let isMatching = -1;
        myAttendances.forEach((attendance) => {
            if (attendance.date_expected === currentDate) {
                isMatching = attendance.attendance_id;
            }
        }); 
        return isMatching; // returns -1 if not existing, an index if otherwise
    }

    async function whenMatchingDates(pos, studentId, currentDate, attendanceId, classId) {
        const attendance = await requests.getById(attendanceUrl, attendanceId);
        const checkInTime = dayjs().format('hh:mm A');
        const checkOutTime = dayjs(currentDate + ' ' + checkInTime).add(1, 'hours').format('hh:mm A'); // assume 1 hour
        console.log(checkInTime);
        console.log(checkOutTime);
        const attendanceData = {
            attendance_id: attendance.attendance_id,
            student_id: attendance.student_id,
            class_number: attendance.class_number, // class number may not be required for student
            date_expected: attendance.date_expected,
            attendance_check: 'Yes',
            date_attended: currentDate,
            check_in: checkInTime,
            hours: 1, // default set
            check_out: checkOutTime,
            payment_number: attendance.payment_number
        }
        requests.edit(attendanceUrl, attendanceData);
        changeCheckedStates(pos, studentId, checkInTime, checkOutTime, classId);
    }

    function findAbsent(myAttendances) {
        let found = -1;
        myAttendances.forEach((attendance) => {
            if (attendance.attendance_check === 'Absent') {
                const currentDate = dayjs().format('MMM D, YYYY');
                const checkInTime = dayjs().format('hh:mm A');
                const checkOutTime = dayjs(checkInTime).add(1, 'hours').format('hh:mm A'); // assume 1
                const attendanceData = {
                    attendance_id: attendance.attendance_id,
                    student_id: attendance.student_id,
                    class_number: attendance.class_number, // class number may not be required for student
                    date_expected: attendance.date_expected,
                    attendance_check: 'Makeup',
                    date_attended: currentDate,
                    check_in: checkInTime,
                    hours: 1, // default set
                    check_out: checkOutTime,
                    payment_number: attendance.payment_number
                }
                requests.edit(attendanceUrl, attendanceData);
                found = attendance.attendance_id;
            }
        });
        return found; // returns -1 if not existing, an index if otherwise
    }

    async function whenAbsentFound(pos, studentId, currentDate, attendanceId, classId) {
        const attendance = await requests.getById(attendanceUrl, attendanceId);
        const checkInTime = dayjs().format('hh:mm A');
        const checkOutTime = dayjs(currentDate + ' ' + checkInTime).add(1, 'hours').format('hh:mm A'); // assume 1
        const attendanceData = {
            attendance_id: attendance.attendance_id,
            student_id: attendance.student_id,
            class_number: attendance.class_number, // class number may not be required for student
            date_expected: attendance.date_expected,
            attendance_check: 'Makeup',
            date_attended: currentDate,
            check_in: checkInTime,
            hours: 1, // default set
            check_out: checkOutTime,
            payment_number: attendance.payment_number
        }
        requests.edit(attendanceUrl, attendanceData);
        changeCheckedStates(pos, studentId, checkInTime, checkOutTime, classId);
    }

    function changeCheckedStates(pos, studentId, checkInTime, checkOutTime, classId) {
        setCheckedState((prevMap) => {
            const newMap = new Map(prevMap); // makes a copy of the previous map
            console.log(classId);
            newMap.set(studentId, [true, checkInTime, checkOutTime, classId]); // since checkbox clicked at studentId, disable it so it always remains true
            localStorage.setItem("checkedState", JSON.stringify(Array.from(newMap.entries()))); // convert to array
            return newMap;
        })
    }

    async function checkHandler(pos, studentId) {
        const currentDayOfWeek = dayjs().format('dddd');
        const currentDate = dayjs().format('MMM D, YYYY');
        const student = await requests.getById(studentUrl, studentId);
        const myAttendances = await fetchMyAttendances(student.student_id, student.student_payment);
        if (student.payment_number === 0) {
            alert('No date matching. Please make new payment');
        } else if (student.day === currentDayOfWeek) {
            // if found, then go through all current attendance dates and compare with current date
            const attendanceId = checkMatchingDates(myAttendances, currentDate)
            if (attendanceId === -1) {
                // because true has already been done, if false, then popup
                alert('No date matching. Please make new payment');
                // maybe also attempt to make the checkbox red?
            } else {
                await whenMatchingDates(pos, studentId, currentDate, attendanceId, student.class_id);
            }
        } else {
            const attendanceId = findAbsent(myAttendances);
            if (attendanceId === -1) {
                // look for first absent in myAttendances
                // because true has already been done,
                // if no absent was found, then this means a new payment must be made
                alert('No date matching. Please make new payment');
                // maybe also attempt to make the checkbox red?
            } else {
                await whenAbsentFound(pos, studentId, currentDate, attendanceId, student.class_id);
            }
        }
    }

    return (
        <div>
            <div className="rectangle">
                <h1 className="student-headers">Students</h1>
                <div className="filters-container">
                    {filters.map((filter, index) => {
                        return (
                            <button 
                                key={filter} 
                                className={`filters ${activeFilter === index ? "active" : ""}`} 
                                onClick={() => {
                                    if (index !== filterIndex) { // only update if the index is different
                                        setFilterIndex(index);
                                    }
                                }}>
                            {filter}
                            </button>
                        )
                    })}
                </div>
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>
                                <StudentForm filterIndex={filterIndex} refreshStudents={refreshStudents}></StudentForm>
                            </th>
                            <th>Student</th>
                            <th></th>
                            <th>Payment Notes</th>
                            <th>Note</th>
                            <th>Day</th>
                            <th>Class ID</th>
                            <th>Phone Number</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((student, index) => {
                            return (
                                <tr key={student.student_id}>
                                    { edit && idEdit === student.student_id ? (
                                        <>
                                            <td></td>
                                            <td>
                                                <input 
                                                    className="student-input"
                                                    name="newFirstName" 
                                                    placeholder={student.first_name} 
                                                    value={newFirstName} 
                                                    onChange={e => setNewFirstName(e.target.value)}/>
                                            </td>
                                            <td>
                                                <input 
                                                    className="student-input"
                                                    name="newLastName" 
                                                    placeholder={student.last_name} 
                                                    value={newLastName} 
                                                    onChange={e => setNewLastName(e.target.value)}/>
                                            </td>
                                            <td>
                                                <input 
                                                    className="student-input"
                                                    name="newPaymentNotes" 
                                                    placeholder={student.payment_notes} 
                                                    value={newPaymentNotes} 
                                                    onChange={e => setNewPaymentNotes(e.target.value)}/>
                                            </td>
                                            <td>
                                                <input 
                                                    className="student-input"
                                                    name="newNotes" 
                                                    placeholder={student.notes} 
                                                    value={newNotes} 
                                                    onChange={e => setNewNotes(e.target.value)}/>
                                            </td>
                                            <td>
                                                <Listbox value={selectedOption} onChange={setSelectedOption}>
                                                    <ListboxButton className="listbox-button">
                                                            {selectedOption.day}
                                                            <RiArrowDropDownLine/>
                                                    </ListboxButton>
                                                        <ListboxOptions className="listbox-options" data-headlessui-state="leave" anchor="bottom">
                                                            {daysOfWeek.map((option) => (
                                                                <ListboxOption className="listbox-option text-sm" key={option.id} value={option}>
                                                                    <div data-focus>
                                                                        {option.day}
                                                                    </div>
                                                                </ListboxOption>
                                                            ))}
                                                        </ListboxOptions>
                                                </Listbox>
                                            </td>
                                            <td>
                                                <input 
                                                    className="student-input"
                                                    name="newClassId" 
                                                    placeholder={student.class_id} 
                                                    value={newClassId} 
                                                    onChange={e => setNewClassId(e.target.value)}/>
                                            </td>
                                            <td>
                                                <input 
                                                    className="student-input"
                                                    name="newPhoneNumber" 
                                                    placeholder={student.phone_number} 
                                                    value={newPhoneNumber} 
                                                    onChange={e => setNewPhoneNumber(e.target.value)}/>
                                            </td>
                                            <td>
                                                <button className="btn" onClick={() => {editStudent(student.student_id, student.payment_number, student.class_number)}}>S</button>
                                            </td>
                                        </> 
                                    ) : (
                                        <>
                                            <td>
                                                <input 
                                                    name={`checkbox-${student.student_id}`} 
                                                    type="checkbox" 
                                                    checked={checkedState.get(student.student_id)?.[0] || false}
                                                    onChange={() => checkHandler(index, student.student_id)}/>
                                            </td>
                                            <td>
                                                {student.first_name} {student.last_name}
                                            </td>
                                            <td>
                                            <IconContext.Provider value={{ className: "linkIcon" }}>
                                                <BsArrowUpRightSquareFill onClick={() => {toAttendancePage(student.student_id)}}/>
                                            </IconContext.Provider>
                                            </td>
                                            <td>{student.payment_notes}</td>
                                            <td>{student.notes}</td>
                                            <td>{student.day}</td>
                                            <td>{student.class_id}</td>
                                            <td>{student.phone_number}</td>
                                            
                                            <td>
                                                <button className="btn" onClick={() => {editButton(student.student_id, student)}}>E</button>
                                            </td>
                                            <td>
                                                <DeleteStudent studentId={student.student_id} filterIndex={filterIndex} refreshStudents={refreshStudents} ></DeleteStudent>
                                            </td>
                                        </>
                                    ) }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div>
                <CheckoutList checkedState={checkedState} students={data}></CheckoutList>
            </div>
        </div>
    )
}
