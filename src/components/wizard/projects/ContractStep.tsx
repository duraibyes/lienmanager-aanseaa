import { useEffect } from 'react';
import { ProjectWizardData } from '../../../types/project';

interface ContractStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onNext?: () => void;
    readonly onBack?: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function ContractStep({ data, onUpdate }: ContractStepProps) {
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
        <div className="">

            <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-8 space-y-6">
                <div className='grid md:grid-cols-3 gap-6 '>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Base Contract Amount
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            value={data.baseContractAmount}
                            onChange={(e) => onUpdate({ baseContractAmount: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-4 py-1.5 border border-slate-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                            Add Additional Costs
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                value={data.additionalCosts}
                                onChange={(e) => onUpdate({ additionalCosts: e.target.value })}
                                placeholder="0.00"
                                className="w-full px-4 py-1.5 border border-slate-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary"
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Revised Cost
                        </label>
                        <input
                            type="text"
                            value={data.revisedCost}
                            readOnly
                            className="w-full px-4 py-1.5 border border-slate-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary"
                        />
                    </div>
                </div>
                <div className='grid md:grid-cols-3 gap-6'>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                            Deduct Payments/Credits
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.paymentsCredits}
                            onChange={(e) => onUpdate({ paymentsCredits: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-4 py-1.5 border border-slate-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Unpaid Balance
                        </label>
                        <input
                            type="text"
                            value={data.unpaidBalance}
                            readOnly
                            className="w-full px-4 py-1.5 border border-slate-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary"
                        />
                    </div>
                </div>


                <div className="border-t border-slate-200 pt-6 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
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
                            className="w-full px-4 py-1.5 border border-slate-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Work Description
                    </label>
                    <textarea
                        value={data.materialServicesDescription}
                        onChange={(e) => onUpdate({ materialServicesDescription: e.target.value })}
                        placeholder="Describe materials, services, or labor included in this contract."
                        rows={4}
                        className="w-full px-4 py-1.5 border border-slate-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary"
                    />
                </div>
            </div>


        </div>
    );
}
