import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'm-0 p-0 w-100 border-0 inline-flex items-center border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none m-0 p-0 w-100 border-0' +
                (active
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
