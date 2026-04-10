import BackBtn from "./BackBtn"
import ContinueBtn from "./ContinueBtn"
import SaveAndExitBtn from "./SaveAndExitBtn"

type footerButtonProps = {
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
    readonly disabled?: boolean;
    readonly onNext: () => void;
    readonly continueDisabled?: boolean;
}

const WizardFooterButton = ({onBack, onSaveAndExit, disabled = false, onNext, continueDisabled = false}: footerButtonProps) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-2">
            <BackBtn onBack={onBack} />

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {onSaveAndExit && (
                    <SaveAndExitBtn onSaveAndExit={onSaveAndExit} disabled={disabled} />
                )}
                <ContinueBtn onNext={onNext} disabled={continueDisabled}  />
            </div>
        </div>
    )
}

export default WizardFooterButton