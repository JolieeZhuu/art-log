// internal imports
import SubmitButton from "./SubmitButton.js";
import InputField from "./InputField.js";

export default function Form({ inputFieldProps, onSubmit, buttonName, cssName, formName }) {
    return (
        <form className={formName} onSubmit={onSubmit}>
            {
                
                inputFieldProps[0].map((element, index) => {
                    return (
                        <div className="label-input" key={index}>
                            <label className="css-label">
                                {element}
                            </label>
                            <InputField
                                type={inputFieldProps[1][index]}
                                value={inputFieldProps[2][index]} 
                                setter={inputFieldProps[3][index]}
                                placeholder={inputFieldProps[4][index]}
                                cssName={cssName}
                            />
                        </div>
                    )
                })
            }
            <SubmitButton 
                buttonName={buttonName}
                cssName={cssName}
            />
        </form>
    );
};
