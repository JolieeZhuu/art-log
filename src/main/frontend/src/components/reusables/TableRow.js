// external imports
import { useEffect, useRef, useState } from "react";

// internal imports
import InputField from "./InputField.js";

export default function TableRow({ index, row, elementId, handleSave, handleEdit, editStates, editData, cssName }) {

    // inputFieldProps: [0]=inputs, [1]=types, [2]=vars, [3]=funcs

    // initializations
    const [isHovering, setIsHovering] = useState(false);
    const rowRef = useRef(null); // tracks a DOM element

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                editStates[0] && 
                rowRef.current && // rowRef is not null (null === false)
                !rowRef.current.contains(event.target) // curser outside of row (DOM element)
            ) {
                editStates[1](false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside); // add eventListener called "mousedown" containing function handleClickOutside
        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // prevents duplication
        };
    }, );

    function handleMouseEnter() {
        setIsHovering(true);
    }

    function handleMouseLeave() {
        setIsHovering(false);
    }

    return (
        <tr ref={rowRef} className="table-row" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {
                editStates[0] ? (
                    <>
                        { editData }
                        <td>
                            <button onClick={(e) => handleSave(e, elementId)}>Save</button>
                        </td>
                    </>
                ) : (
                    <>
                        { /* "element" stores a line of JSX */
                            row.map((element, index) => {
                                return (
                                    <td key={index}>
                                        {element}
                                    </td>
                                )
                            })
                        }
                        <td>
                            {
                                isHovering ? (
                                    <button onClick={() => handleEdit(index)
                                    }>Edit</button>
                                ) : (
                                    <></>
                                )
                            }
                        </td>
                    </>
                )
            }
        </tr>
    )
};
