export default function SubmitButton({ buttonName, cssName }) {
    return (
        <>
            <button 
                type="submit"
                className={cssName}
            >{buttonName}</button>
        </>
    );
};
