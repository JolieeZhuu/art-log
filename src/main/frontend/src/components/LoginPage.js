// external imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// internal imports
import { Controller } from "../restAPI/entities.js";
import Form from "./reusables/Form.js";

export default function LoginPage() {
    
    // initializations
    const requests = new Controller();
    const adminUrl = "http://localhost:8080/admin/";
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isMatching, setIsMatching] = useState(true);

    // variables for props passing
    const inputs = ["Username", "Password"];
    const types = ["text", "password"]; // parallel array with INPUTS
    const vars = [username, password];
    const funcs = [setUsername, setPassword]; // parallel array with VARS
    const placeholders = ["ex: emmawatson", "ex: watsonemma"]

    async function handleSubmit(e) {
        const admins = new Map();
        // prevents browser from reloading page
        e.preventDefault();

        // pair admin username and password
        await requests.getAll(adminUrl)
        .then(data => {
            data.forEach((admin) => {
                admins.set(admin.username, admin.password);
                console.log(admin.username)
            })
        })

        console.log(username);
        console.log(password);

        if (admins.get(username) === password) {
            setIsMatching(true);
            setTimeout(() => {
                navigate(`/summary`);
            }, 100);
        } else {
            setIsMatching(false);
            console.log("username or password is incorrect"); // DEBUG
            setUsername("");
            setPassword("");
        }
    }

    // JSX display
    return (
        <div id="login-page">
            <h1>ART.LOG</h1>
            <Form
                inputFieldProps={[inputs, types, vars, funcs, placeholders]}
                onSubmit={handleSubmit}
                buttonName="Login"
                cssName="css-login"
                formName="login-form"
            />
            {
                !isMatching && (
                    <p>Username or password is incorrect</p>
            )}
        </div>
    );
};
