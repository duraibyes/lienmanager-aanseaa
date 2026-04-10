import { useNavigate } from "react-router-dom"
import { Calendar, ClipboardList, FileText } from "lucide-react"
import { DBProject } from "../../../types/project"

interface QuickActionColumnProps {
    data: DBProject
}

const QuickActionColumn = ({ data }: QuickActionColumnProps) => {
    const navigate = useNavigate();
    return (
        <div className="text-center">
            {data.project_date.length > 0 &&
                <button
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Deadlines"
                    onClick={() => navigate(`/deadlines?projectId=${data.id}`)}
                >
                    <Calendar className="w-4 h-4" />
                </button>
            }
            {data.tasks.length > 0 &&
                <button
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Tasks"
                    onClick={() => navigate('/tasks', { state: { project_name: data.project_name } })}
                >
                    <ClipboardList className="w-4 h-4" />
                </button>
            }
            {data.documents.length > 0 &&
                <button
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Documents"
                    onClick={() => navigate('/documents', { state: { project_id: data.id } })}
                >
                    <FileText className="w-4 h-4" />
                </button>
            }
        </div>
    )
}

export default QuickActionColumn