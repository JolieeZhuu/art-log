// internal imports
import Navigation from "../reusables/Navigation.js";
import CheckOutListCard from "../CheckOutListCard.js";
import StudentListCard from "../StudentListCard.js";

export default function Tuesday(params) {
    return (
        <div id="tuesday" className="navbar-page">
            <Navigation/>
            <div>
                <h2>Tuesday</h2>
                <div className="student-list-cards">
                    <StudentListCard timeOfDay="Morning" dayOfWeek="Tuesday"/>
                    <StudentListCard timeOfDay="Afternoon" dayOfWeek="Tuesday"/>
                </div>
                <CheckOutListCard/>
            </div>
        </div>
    )
};
