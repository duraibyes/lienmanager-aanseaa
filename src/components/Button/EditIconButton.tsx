import { Edit } from "lucide-react";

type EditIconButtonProps = {
    onClick: () => void;
    title?: string;
};

const EditIconButton = ({ onClick, title = "Edit" }: EditIconButtonProps) => {
    return (
        <button
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
            title={title}
            onClick={onClick}
        >
            <Edit className="w-4 h-4" />
        </button>
    );
};

export default EditIconButton;