import { React, useState } from "react";
import { Controller } from "../../restAPI/entities.js";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import '../index.css';
import '../popup.css';

export default function StudentForm({ filterIndex, refreshStudents }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [classId, setClassId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const studentUrl = 'http://localhost:8080/student/';
    const requests = new Controller();

    const [isFilled, setIsFilled] = useState(true);

    // for list box
    const daysOfWeek = [
        {id: 1, day: 'Sunday'},
        {id: 2, day: 'Monday'},
        {id: 3, day: "Tuesday"},
        {id: 4, day: "Wednesday"},
        {id: 5, day: "Thursday"},
        {id: 6, day: "Friday"},
        {id: 7, day: "Saturday"}
    ];
    const [selectedOption, setSelectedOption] = useState({id: 8, day: ''});

    async function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        if (firstName === '' || lastName === '' || classId === '' || selectedOption.day === '' || phoneNumber === '') {
            setIsFilled(false);
        } else {
            setIsFilled(true);
            const data = {
                first_name: firstName,
                last_name: lastName,
                class_id: classId,
                day: selectedOption.day,
                phone_number: phoneNumber,
                payment_number: 0,
                class_number: 0,
                notes: 'Notes for ' + firstName,
                payment_notes: 'Payment notes for ' + firstName
            }
    
            requests.add(studentUrl, data)
            .then(() => {
                refreshStudents(filterIndex); // function will automatically use the right index
                setFirstName("");
                setLastName("");
                setClassId("");
                setPhoneNumber("");
            })
            setIsOpen(false);
        }
    }

    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="btn">Create</button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="dialog-container">
                <DialogBackdrop className="panel-bg" />
                <div className="dialog-overlay">
                    <DialogPanel className="dialog-panel">
                        <DialogTitle className="dialog-title">Add a student</DialogTitle>
                        <Description>Please make sure to input values for all required</Description>
                        <form onSubmit={handleSubmit}>
                            <div className="form">
                                <input name="firstName" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                                <input name="lastName" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                                <input name="classId" placeholder="Class ID" value={classId} onChange={e => setClassId(e.target.value)} />
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
                                <input name="phoneNumber" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                {!isFilled && (
                                    <p className="warning-message">Please fill in all fields</p>
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