// external imports
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';

// internal imports
import Navigation from "./reusables/Navigation.js";
import StudentDBInfo from "./StudentDBInfo.js";
import Popup from "./reusables/Popup.js";
import AttendanceListCard from "./AttendanceListCard.js";
import { getPaymentNum, addPaymentNum, addNewPaymentTable } from "../functions/paymentFuncs.js";

export default function StudentDB() {
    // initializations
    const { id, day } = useParams(); // deconstruct object to separate id
    const cssIDName = "#" + day.toLowerCase();

    const [date, setDate] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [cardList, setCardList] = useState([]);

    // variables for props passing
    const inputs = ["Date Expected"];
    const types = ["date"];
    const vars = [date];
    const funcs = [setDate];
    const placeholders = [""];

    useEffect(() => {
        async function loadAttendanceCards() {
            const num = await getPaymentNum(id);
            let tempNum;
            if (num >= 2) {
                tempNum = 2;
            } else {
                tempNum = num;
            }
            const cards = Array.from({length: tempNum}).map((_, index) => {
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
    }, [id])    

    async function handleSubmit(e) {
        let isInputValid = true; // local variable since isValid will still be true despite setter
        vars.forEach(element => {
            if (element === null || element === "" || element === "Invalid Date") {
                isInputValid = false;
            }
        })
        setIsValid(isInputValid);
        if (isInputValid) {
            const formattedDate = dayjs(date).format('MMM D, YYYY'); // Jan 1, 2025
            const currentPaymentNum = await addPaymentNum(id);
            await addNewPaymentTable(id, formattedDate, currentPaymentNum);

            setDate("");
            setIsOpen(false);
            setIsValid(true);
        }
    }    

    return (
        <div className="navbar-page">
            <Navigation/>
            <div>
                <StudentDBInfo id={id} cssIDName={cssIDName} day={day}/>
                <Popup
                    setGetOpen={[isOpen, setIsOpen]}
                    setGetValid={[isValid, setIsValid]}
                    buttonName="New Payment"
                    inputFieldProps={[inputs, types, vars, funcs, placeholders]}
                    onSubmit={handleSubmit}
                    submitButtonName="Create Payment Table"
                    cssName="css-create-student"
                    formName="create-student-form"
                    popupTitle="Add Payment Table Form"
                    popupDes="Please fill in the field for the expected first class of the art student."
                />
                {cardList}
            </div>
        </div>
    )
};