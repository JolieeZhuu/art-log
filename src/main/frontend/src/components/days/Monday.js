// internal imports
import Navigation from "../reusables/Navigation.js";
import CheckOutListCard from "../CheckOutListCard.js";
import StudentListCard from "../StudentListCard.js";

export default function Monday() {

    return (
        <div id="monday" className="navbar-page">
            <Navigation/>
            <div>
                <h2>Monday</h2>
                <div className="student-list-cards">
                    <StudentListCard timeOfDay="Morning" dayOfWeek="Monday"/>
                    <StudentListCard timeOfDay="Afternoon" dayOfWeek="Monday"/>
                </div>
                <CheckOutListCard/>
            </div>
        </div>
    )
};
