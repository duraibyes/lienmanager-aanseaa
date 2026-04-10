import { ArrowLeft } from "lucide-react"

type BackBtnProps = {
    readonly onBack: () => void;
}

const BackBtn = ({ onBack }: BackBtnProps) => {
    return (
        <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
            <ArrowLeft className="w-5 h-5" />
            Back
        </button>
    )
}

export default BackBtn