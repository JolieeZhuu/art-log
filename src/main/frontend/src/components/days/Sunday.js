// internal imports
import Navigation from "../reusables/Navigation.js";
import CheckOutListCard from "../CheckOutListCard.js";
import StudentListCard from "../StudentListCard.js";

export default function Sunday(params) {
    return (
        <div id="sunday" className="navbar-page">
            <Navigation/>
            <div>
                <h2 className="header">Sunday</h2>
                <div className="student-list-cards">
                    <StudentListCard timeOfDay="Morning" dayOfWeek="Sunday"/>
                    <StudentListCard timeOfDay="Afternoon" dayOfWeek="Sunday"/>
                </div>
                <CheckOutListCard/>
            </div>
        </div>
    )
};
