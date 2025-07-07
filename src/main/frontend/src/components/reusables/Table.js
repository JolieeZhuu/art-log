// external imports
import { useEffect } from "react";

// internal imports
import TableRow from "./TableRow.js";

export default function Table({ data, refreshFunc, headers, handleSave, handleEdit, inputFieldProps, cssName}) {

    useEffect(() => {
        refreshFunc();
    }, [refreshFunc])

    return (
        <div>
            <table className="scrollable-table">
                <thead>
                    <tr>
                        {
                            headers.map((heading, index) => {
                                return (
                                    <th key={index}>{heading}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
            </table>
            <div>
                <table className="scrollable-table">
                    <tbody>
                        {
                            data.map((row, index) => {
                                console.log(row);
                                return (
                                    <TableRow
                                        key={index}
                                        index={index}
                                        row={row}
                                        handleSave={handleSave}
                                        handleEdit={handleEdit}
                                        inputFieldProps={inputFieldProps}
                                        cssName={cssName}
                                    />
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
};
