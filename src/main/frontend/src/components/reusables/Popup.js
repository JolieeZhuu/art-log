// external imports
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

// internal imports
import Form from "./Form.js";

export default function Popup({ isOpen, setIsOpen, buttonName, inputs, types, vars, funcs, onSubmit, submitButtonName, cssName, formName, popupTitle, popupDes, validVar, validFunc }) {
    function handleOnClose() {
        setIsOpen(false);
        validFunc(true);
    }
    return (
        <div>
            <button onClick={() => setIsOpen(true)}>{buttonName}</button>
            <Dialog open={isOpen} onClose={handleOnClose} className="dialog-container">
                <DialogBackdrop className="panel-bg"/>
                <div className="dialog-overlay">
                    <DialogPanel className="dialog-panel">
                        <DialogTitle className="dialog-title">{popupTitle}</DialogTitle>
                        <Description>{popupDes}</Description>
                        <Form
                            inputs={inputs}
                            types={types}
                            vars={vars}
                            funcs={funcs}
                            onSubmit={onSubmit}
                            buttonName={submitButtonName}
                            cssName={cssName}
                            formName={formName}
                        />
                        {
                            !validVar && (
                                <p>Invalid response. Please complete all fields.</p>
                            )
                        }
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
};
