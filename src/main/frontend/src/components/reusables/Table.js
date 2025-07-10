// external imports
import { useEffect } from "react";

// internal imports
import TableRow from "./TableRow.js";

export default function Table({ data, elementIds, refreshFunc, headers, handleSave, handleEdit, editStates, editData, cssName}) {

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
                                return (
                                    <TableRow
                                        key={index}
                                        index={index}
                                        row={row}
                                        elementId={elementIds[index]}
                                        handleSave={handleSave}
                                        handleEdit={handleEdit}
                                        editStates={editStates}
                                        editData={editData}
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
