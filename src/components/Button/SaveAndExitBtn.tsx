type SaveAndExitProps = {
    readonly disabled?: boolean;
    readonly onSaveAndExit: () => void;
}

const SaveAndExitBtn = ({ onSaveAndExit, disabled }: SaveAndExitProps) => {
    return (
        <button
            onClick={onSaveAndExit}
            disabled={disabled}
            className="px-6 py-3 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
        >
            {disabled ? 'Saving...' : 'Save & Exit to Dashboard'}
        </button>
    )
}

export default SaveAndExitBtn;