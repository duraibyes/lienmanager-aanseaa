import { FolderOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { handleAddProject } from "../../../utils/navigation";

const NewProjectCreateCard = () => {

    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Projects Yet</h3>
            <p className="text-slate-600 mb-6">
                Get started by creating your first project
            </p>
            <button
                onClick={() => handleAddProject(navigate)}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
                Create Your First Project
            </button>

        </div>
    )
}

export default NewProjectCreateCard