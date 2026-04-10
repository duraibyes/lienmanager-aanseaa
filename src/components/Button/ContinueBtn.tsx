import { ArrowRight } from "lucide-react"

type ContinueBtnProps = {
    readonly onNext: () => void;
    readonly disabled?: boolean;
}

const ContinueBtn = ({onNext, disabled}: ContinueBtnProps) => {
    console.log(' conutnu buttn disblaed ', disabled)
    return (
        <button
            onClick={onNext}
            disabled={disabled}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
            Continue
            <ArrowRight className="w-5 h-5" />
        </button>
    )
}

export default ContinueBtn