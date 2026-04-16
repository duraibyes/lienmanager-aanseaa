import { ArrowRight, FolderOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { handleAddProject } from "../../../utils/navigation";

const NewProjectCreateCard = () => {

    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <FolderOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Projects Yet</h3>
            <p className="text-slate-600 mb-6">
                Get started by creating your first project
            </p>

            <Button className="gradient-primary hover:opacity-90" onClick={() => handleAddProject(navigate)}>
                Add Your First Project
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    )
}

export default NewProjectCreateCard