// internal imports
import SubmitButton from "./SubmitButton.js";
import InputField from "./InputField.js";

export default function Form({ inputs, types, vars, funcs, onSubmit, buttonName, cssName, formName }) {

    return (
        <form className={formName} onSubmit={onSubmit}>
            {
                inputs.map((element, index) => {
                    return (
                        <InputField 
                            key={index} 
                            type={types[index]} 
                            placeholder={element} 
                            value={vars[index]} 
                            setter={funcs[index]}
                            cssName={cssName}
                        />
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
