export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `h5 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
