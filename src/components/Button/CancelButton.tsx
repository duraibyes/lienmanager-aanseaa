
const CancelButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full py-3.5 text-slate-600 font-bold hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
            {label}
        </button>
    )
}

export default CancelButton