import { Trash2 } from "lucide-react"

type DeleteProps = {
    id: number;
    handleDelete: (id: number) => void;
}

const DeleteIconButton = ({ id, handleDelete }: DeleteProps) => {
    return (
        <button
            className="p-1.5 text-primary  hover:bg-primary/10 rounded transition-colors"
            title="Delete"
            onClick={() => handleDelete(Number(id))}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    )
}

export default DeleteIconButton