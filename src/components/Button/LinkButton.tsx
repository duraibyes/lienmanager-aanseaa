import { Link } from "react-router-dom"

type Props = {
    to: string;
    label: string;
    isActive?: boolean;
    isSmall?: boolean;
}

const LinkButton = ({ to, label, isActive = true, isSmall = false }: Props) => {
    return (
        <Link
            to={to}
            className={`font-semibold ${isActive ? 'text-primary' : 'text-textMuted'} hover:text-underline-offset-4 decoration-1 ${isSmall ? 'text-sm' : ''}`}
        >
            {label}
        </Link>
    )
}

export default LinkButton