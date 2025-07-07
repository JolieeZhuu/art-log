export default function InputField({ type, placeholder, value, setter, cssName}) {
    return (
        <>
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={e => setter(e.target.value)}
                className={cssName}
            />
        </>
    );
};
