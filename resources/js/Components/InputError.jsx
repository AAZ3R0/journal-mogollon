export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'fw-bold text-danger ' + className}
        >
            {message}
        </p>
    ) : null;
}
