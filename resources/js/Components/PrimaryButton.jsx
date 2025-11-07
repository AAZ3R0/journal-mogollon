export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `h3 ${
                    disabled && 'bg-opacity-25 '
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
