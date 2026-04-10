import { useEffect } from 'react';
import { ProjectWizardData } from '../../../types/project';
import WizardFooterButton from '../../Button/WizardFooterButton';

interface ContractStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function ContractStep({ data, onUpdate, onNext, onBack, onSaveAndExit }: ContractStepProps) {
    useEffect(() => {
        const baseAmount = parseFloat(data.baseContractAmount) || 0;
        const additional = parseFloat(data.additionalCosts) || 0;
        const payments = parseFloat(data.paymentsCredits) || 0;

        const revised = baseAmount + additional;
        const unpaid = revised - payments;

        onUpdate({
            revisedCost: revised.toFixed(2),
            unpaidBalance: unpaid.toFixed(2),
        });
    }, [data.baseContractAmount, data.additionalCosts, data.paymentsCredits]);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 md:py-12">
            <div className="mb-8">
                <h1 className="text:xl md:text-3xl font-bold text-slate-900 mb-3">Contract Details</h1>
                <p className="text-sm md:text-lg text-slate-600">
                    Enter contract amounts and financial information.
                </p>
            </div>

            <div className="bg-white rounded-b-xl border border-slate-200 p-4 md:p-8 space-y-6">
                <div className='grid md:grid-cols-3 gap-6 '>

                    <div>
                        <label className="block text-sm font-medium text-blue-600 mb-2">
                            Base Contract Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.baseContractAmount}
                            onChange={(e) => onUpdate({ baseContractAmount: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                            Add Additional Costs
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                value={data.additionalCosts}
                                onChange={(e) => onUpdate({ additionalCosts: e.target.value })}
                                placeholder="0.00"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                            >
                                <span className="text-slate-400 text-xs">⋮</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-600 mb-2">
                            Revised Cost
                        </label>
                        <input
                            type="text"
                            value={data.revisedCost}
                            readOnly
                            className="w-full px-4 py-2.5 border border-slate-300 rounded bg-slate-100 text-slate-700"
                        />
                    </div>
                </div>
                <div className='grid md:grid-cols-3 gap-6'>

                    <div>
                        <label className="block text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                            Deduct Payments/Credits
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.paymentsCredits}
                            onChange={(e) => onUpdate({ paymentsCredits: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-600 mb-2">
                            Unpaid Balance
                        </label>
                        <input
                            type="text"
                            value={data.unpaidBalance}
                            readOnly
                            className="w-full px-4 py-2.5 border border-slate-300 rounded bg-slate-100 text-slate-700"
                        />
                    </div>
                </div>


                <div className="border-t border-slate-200 pt-6 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-600 mb-2">
                            Your Job/Project No.
                        </label>
                        <input
                            type="text"
                            value={data.jobProjectNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                onUpdate({ jobProjectNumber: value })
                            }}
                            placeholder="Enter job/project number"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-600 mb-2">
                        Work Description
                    </label>
                    <textarea
                        value={data.materialServicesDescription}
                        onChange={(e) => onUpdate({ materialServicesDescription: e.target.value })}
                        placeholder="Describe materials, services, or labor included in this contract."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>
            </div>

            <WizardFooterButton
                onBack={onBack}
                onSaveAndExit={onSaveAndExit}
                onNext={onNext}
            />
        </div>
    );
}
