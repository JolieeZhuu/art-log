// internal imports
import Navigation from "../reusables/Navigation.js";
import CheckOutListCard from "../CheckOutListCard.js";
import StudentListCard from "../StudentListCard.js";

export default function Saturday(params) {
    return (
        <div id="saturday" className="navbar-page">
            <Navigation/>
            <div>
                <h2 className="header">Saturday</h2>
                <div className="student-list-cards">
                    <StudentListCard timeOfDay="Morning" dayOfWeek="Saturday"/>
                    <StudentListCard timeOfDay="Afternoon" dayOfWeek="Saturday"/>
                </div>
                <CheckOutListCard/>
            </div>
        </div>
    )
};
