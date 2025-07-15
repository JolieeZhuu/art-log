// internal imports
import Navigation from "../reusables/Navigation.js";
import CheckOutListCard from "../CheckOutListCard.js";
import StudentListCard from "../StudentListCard.js";

export default function Thursday(params) {
    return (
        <div id="thursday" className="navbar-page">
            <Navigation/>
            <div>
                <h2 className="header">Thursday</h2>
                <div className="student-list-cards">
                    <StudentListCard timeOfDay="Morning" dayOfWeek="Thursday"/>
                    <StudentListCard timeOfDay="Afternoon" dayOfWeek="Thursday"/>
                </div>
                <CheckOutListCard/>
            </div>
        </div>
    )
};
