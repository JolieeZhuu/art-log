// internal imports
import Navigation from "../reusables/Navigation.js";
import CheckOutListCard from "../CheckOutListCard.js";
import StudentListCard from "../StudentListCard.js";

export default function Friday(params) {
    return (
        <div id="friday" className="navbar-page">
            <Navigation/>
            <div>
                <h2>Friday</h2>
                <div className="student-list-cards">
                    <StudentListCard timeOfDay="Morning" dayOfWeek="Friday"/>
                    <StudentListCard timeOfDay="Afternoon" dayOfWeek="Friday"/>
                </div>
                <CheckOutListCard/>
            </div>
        </div>
    )
};
