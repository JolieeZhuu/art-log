// external imports
import { useEffect, useRef, useState } from "react";

// internal imports
import InputField from "./InputField.js";

export default function TableRow({ index, row, handleSave, handleEdit, inputFieldProps, cssName }) {

    // inputFieldProps: [0]=inputs, [1]=types, [2]=vars, [3]=funcs

    // initializations
    const [editMode, setEditMode] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const rowRef = useRef(null); // tracks a DOM element

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                editMode && 
                rowRef.current && // rowRef is not null (null === false)
                !rowRef.current.contains(event.target) // curser outside of row (DOM element)
            ) {
                setEditMode(false);
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
                editMode ? (
                    <>
                        { /* "element" stores a line of JSX */
                            inputFieldProps[0].map((element, index) => {
                                return (
                                    <td key={index}>
                                        <InputField
                                            type={inputFieldProps[1][index]} 
                                            placeholder={row[index]} 
                                            value={inputFieldProps[2][index]} 
                                            setter={inputFieldProps[3][index]} 
                                            cssName={cssName}
                                        />
                                    </td>
                                )
                            })
                        }
                        <td>
                            <button onClick={(e) => handleSave(e, setEditMode)}>Save</button>
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
                                    <button onClick={() => handleEdit(index, setEditMode)
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
