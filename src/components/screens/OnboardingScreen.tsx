import { useState } from 'react';
import { Plus, CheckCircle, FolderOpen, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleAddProject } from '../../utils/navigation';

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Welcome to Your Project Dashboard",
      description: "Manage all your projects in one place with powerful tools to keep everything organized.",
      icon: Sparkles,
      color: "blue",
      tips: [
        "Create unlimited projects",
        "Track deadlines and milestones",
        "Store important documents",
        "Collaborate with contacts"
      ]
    },
    {
      title: "Create Your First Project",
      description: "Get started by creating a project. Our guided wizard will help you set up everything you need.",
      icon: FolderOpen,
      color: "green",
      tips: [
        "Enter basic project details",
        "Add contacts and parties",
        "Upload important documents",
        "Set deadlines and tasks"
      ]
    },
    {
      title: "Organize Your Contacts",
      description: "Keep all your contacts in one place and easily assign them to projects.",
      icon: Users,
      color: "purple",
      tips: [
        "Add company information",
        "Store contact details",
        "Link contacts to projects",
        "Quick access anytime"
      ]
    },
    {
      title: "Ready to Get Started?",
      description: "You're all set! Click the button below to create your first project.",
      icon: CheckCircle,
      color: "blue",
      tips: [
        "Use the wizard for guidance",
        "Fill in as much or as little detail",
        "Save drafts and come back later",
        "Everything can be edited anytime"
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
        handleAddProject(navigate)
    }
  };

  const onBackToDashboard = () => {
    navigate('/dashboard');
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4 sm:p-6">
  <div className="max-w-4xl w-full">
    
    {/* Header */}
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
      </div>

      <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">
        Welcome Aboard!
      </h1>

      <p className="text-sm sm:text-lg text-slate-600 px-2">
        Let's take a quick tour of what you can do
      </p>
    </div>

    {/* Card */}
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 border border-slate-200">
      
      {/* Progress */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-10 sm:w-12 bg-blue-600'
                  : index < currentStep
                  ? 'w-2 bg-blue-600'
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-6 sm:mb-8">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6 ${
            currentStepData.color === 'blue'
              ? 'bg-blue-100'
              : currentStepData.color === 'green'
              ? 'bg-green-100'
              : 'bg-purple-100'
          }`}
        >
          <IconComponent
            className={`w-8 h-8 sm:w-10 sm:h-10 ${
              currentStepData.color === 'blue'
                ? 'text-blue-600'
                : currentStepData.color === 'green'
                ? 'text-green-600'
                : 'text-purple-600'
            }`}
          />
        </div>

        <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
          {currentStepData.title}
        </h2>

        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
          {currentStepData.description}
        </p>
      </div>

      {/* Tips */}
      <div className="bg-slate-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {currentStepData.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-slate-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        <button
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-slate-600 hover:text-slate-900 font-medium transition-colors"
          onClick={onBackToDashboard}
        >
          Skip Tour
        </button>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3 sm:gap-4">
          
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create First Project
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-6 sm:mt-8 text-center">
      <p className="text-xs sm:text-sm text-slate-500">
        Step {currentStep + 1} of {steps.length}
      </p>
    </div>
  </div>
</div>
  );
}
