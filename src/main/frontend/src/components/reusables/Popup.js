// external imports
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

// internal imports
import Form from "./Form.js";

export default function Popup({ setGetOpen, setGetValid, buttonName, inputFieldProps, onSubmit, submitButtonName, cssName, formName, popupTitle, popupDes }) {
    function handleOnClose() {
        setGetOpen[1](false);
        setGetValid[1](true);
    }
    return (
        <div>
            <button onClick={() => setGetOpen[1](true)}>{buttonName}</button>
            <Dialog open={setGetOpen[0]} onClose={handleOnClose} className="dialog-container">
                <DialogBackdrop className="panel-bg"/>
                <div className="dialog-overlay">
                    <DialogPanel className="dialog-panel">
                        <DialogTitle className="dialog-title">{popupTitle}</DialogTitle>
                        <Description>{popupDes}</Description>
                        <Form
                            inputFieldProps={inputFieldProps}
                            onSubmit={onSubmit}
                            buttonName={submitButtonName}
                            cssName={cssName}
                            formName={formName}
                        />
                        {
                            !setGetValid[0] && (
                                <p>Invalid response. Please complete all fields.</p>
                            )
                        }
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
};
