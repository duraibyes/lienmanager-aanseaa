import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2";
import { FolderOpen } from "lucide-react"
import { handleViewProject } from "../../../utils/navigation"
import { DBProject } from "../../../types/project"
import { useDeleteWizardDraftMutation } from "../../../features/project/projectDataApi";
import DeleteIconButton from "../../Button/DeleteIconButton";
import EditIconButton from "../../Button/EditIconButton";

interface ActionColumnProps {
    data: DBProject;
}
const ActionColumn = ({ data }: ActionColumnProps) => {
    const navigate = useNavigate();

    const [deleteWizardDraft] = useDeleteWizardDraftMutation();

    const handleDelete = async (id: number) => {
    
            const result = await Swal.fire({
                title: "Are you sure?",
                text: `Do you want to delete this project?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                buttonsStyling: false,
                customClass: {
                    confirmButton:
                        "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mx-2",
    
                    cancelButton:
                        "bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2",
                },
            });
            if (result.isConfirmed) {
    
                try {
                    await deleteWizardDraft({ id }).unwrap();
    
                    Swal.fire({
                        title: "Deleted!",
                        text: "Project has been deleted.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
    
                } catch (error) {
    
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete project.",
                        icon: "error",
                    });
    
                }
            }
        };

    return (
        <div className="text-center">
            <button
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View"
                onClick={() => handleViewProject(navigate, data.id)}
            >
                <FolderOpen className="w-4 h-4" />
            </button>

            <EditIconButton
                onClick={() => navigate(`/project/create/${data.id}`)}
            />
            
            <DeleteIconButton id={Number(data.id)} handleDelete={handleDelete}/>
        </div>
    )
}

export default ActionColumn