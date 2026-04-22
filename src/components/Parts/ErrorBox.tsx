import { AlertCircle } from "lucide-react"

const ErrorBox = ({ error }: { error: string }) => {
    return (
        <div className="error-box flex items-center justify-center gap-4 bg-red-50 p-2 my-4 rounded-md">
            <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-red-500">{error}</p>
        </div>
    )
}

export default ErrorBox