import { Link } from "react-router-dom";

const Breadcrumb = () => {
    return (
        <nav>
            <ol className="flex items-center gap-1.5">

                {/* Home */}
                <li>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                    >
                        Home
                        <svg
                            className="stroke-current"
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                        >
                            <path
                                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </li>

                {/* Current Page */}
                <li className="text-sm text-gray-800 dark:text-white/90">
                    Profile
                </li>

            </ol>
        </nav>
    );
};

export default Breadcrumb;