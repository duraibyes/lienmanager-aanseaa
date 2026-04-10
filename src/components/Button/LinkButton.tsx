import { Link } from "react-router-dom"

type Props = {
    to: string;
    label: string;
}

const LinkButton = ({ to, label }: Props) => {
    return (
        <Link
            to={to}
            className="font-semibold text-primary hover:text- underline-offset-4 decoration-2"
        >
            {label}
        </Link>
    )
}

export default LinkButton