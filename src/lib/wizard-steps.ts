export interface WizardStep {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  entered?: boolean;
  isClickable?: boolean;
}

export interface WizardContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  completedSteps: number[];
  markStepComplete: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  skipStep: () => void;
  saveAndExit: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: "Upload Documents",
    shortTitle: "Upload",
    icon: "upload",
    description: "Upload contracts, agreements, or project documents",
  },
  {
    id: 2,
    title: "Project Details",
    shortTitle: "Details",
    icon: "file-text",
    description: "Enter basic project information",
  },
  {
    id: 3,
    title: "Important Dates",
    shortTitle: "Dates",
    icon: "calendar",
    description: "Set key project milestones and deadlines",
  },
  {
    id: 4,
    title: "Description",
    shortTitle: "Description",
    icon: "align-left",
    description: "Add detailed project description",
  },
  {
    id: 5,
    title: "Contract Info",
    shortTitle: "Contract",
    icon: "file-signature",
    description: "Contract details and terms",
  },
  {
    id: 6,
    title: "Contacts",
    shortTitle: "Contacts",
    icon: "users",
    description: "Add project stakeholders and contacts",
  },
  {
    id: 7,
    title: "Documents",
    shortTitle: "Documents",
    icon: "folder",
    description: "Manage additional project documents",
  },
  {
    id: 8,
    title: "Deadlines",
    shortTitle: "Deadlines",
    icon: "clock",
    description: "Set important deadlines and reminders",
  },
  {
    id: 9,
    title: "Tasks",
    shortTitle: "Tasks",
    icon: "check-square",
    description: "Create and assign project tasks",
  },
  {
    id: 10,
    title: "Summary",
    shortTitle: "Summary",
    icon: "clipboard-list",
    description: "Review all entered information",
  },
  {
    id: 11,
    title: "Info Sheet",
    shortTitle: "Info Sheet",
    icon: "file-check",
    description: "Generate final project info sheet",
  },
];
