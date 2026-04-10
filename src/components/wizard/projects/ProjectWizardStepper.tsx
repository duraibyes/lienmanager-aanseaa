import { Check } from 'lucide-react';

interface ProjectWizardStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  isEditMode?: boolean;
}

const WIZARD_STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Dates' },
  { id: 4, label: 'Description' },
  { id: 5, label: 'Contract' },
  { id: 6, label: 'Contacts' },
  { id: 7, label: 'Documents' },
  { id: 8, label: 'Deadlines' },
  { id: 9, label: 'Tasks' },
  { id: 10, label: 'Summary' },
  { id: 11, label: 'Info Sheet' },
];

export default function ProjectWizardStepper({ currentStep, onStepClick, isEditMode }: ProjectWizardStepperProps) {
  const getStepState = (stepId: number): 'completed' | 'current' | 'upcoming' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white border-b border-slate-200 py-4 md:py-6 px-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between min-w-max">
          {WIZARD_STEPS.map((step, index) => {
            const state = getStepState(step.id);
            const isClickable = isEditMode || step.id <= currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={`
                      md:w-12 md:h-12 w-8 h-8 rounded-full flex items-center justify-center font-bold md:text-sm text-xs
                      transition-all duration-200 border-2
                      ${state === 'completed' ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' : ''}
                      ${state === 'current' ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg' : ''}
                      ${state === 'upcoming' ? 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed' : ''}
                      ${isClickable && state !== 'current' ? 'cursor-pointer' : ''}
                    `}
                  >
                    {state === 'completed' ? <Check className="w-6 h-6" /> : step.id}
                  </button>
                  <span className={`
                    mt-2 text-xs font-medium text-center whitespace-nowrap
                    ${state === 'current' ? 'text-blue-600 font-bold' : ''}
                    ${state === 'completed' ? 'text-green-600' : ''}
                    ${state === 'upcoming' ? 'text-slate-400' : ''}
                  `}>
                    {step.label}
                  </span>
                </div>

                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`
                    h-0.5 w-16 mx-2 transition-all duration-200
                    ${step.id < currentStep ? 'bg-green-500' : 'bg-slate-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
