// internal imports
import Navigation from "../reusables/Navigation.js";
import CheckOutListCard from "../CheckOutListCard.js";
import StudentListCard from "../StudentListCard.js";

export default function Wednesday(params) {
    return (
        <div id="wednesday" className="navbar-page">
            <Navigation/>
            <div>
                <h2 className="header">Wednesday</h2>
                <div className="student-list-cards">
                    <StudentListCard timeOfDay="Morning" dayOfWeek="Wednesday"/>
                    <StudentListCard timeOfDay="Afternoon" dayOfWeek="Wednesday"/>
                </div>
                <CheckOutListCard/>
            </div>
        </div>
    )
};
