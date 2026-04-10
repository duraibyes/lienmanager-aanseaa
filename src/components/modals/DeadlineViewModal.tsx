import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { AlertCircle, Bell, Calendar, Clock } from "lucide-react";

export type DeadlineInfo = {
    project_id: number;
    project_name: string;
    title: string;
    date: string;
    is_late: boolean;
    daysRemaining: string;
    requirement: string;
    remedies: {
        title: string;
        description: string;
    }
}

export type DeadlineDetails = {
    project_id: number;
    project_name: string;
    is_late: boolean;
    deadline: DeadlineInfo
}

type DeadlineInfoProps = {
    isOpen: boolean;
    onClose: () => void;
    data: DeadlineDetails;
}

const DeadlineViewModal = ({ isOpen, onClose, data }: DeadlineInfoProps) => {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth >
            <DialogTitle>
                Deadline Info
                <IconButton onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8
                    }}
                >
                    X
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className="p-2 sm:p-6 space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Project Information</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Action</p>
                                <p className="text-lg font-semibold text-slate-900">{data?.deadline?.title}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Project</p>
                                {/* {onViewProject ? (
                                    <button
                                        onClick={() => onViewProject(selectedDeadline.project_id)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                                    >
                                        {selectedDeadline.project_name}
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                ) : ( */}
                                <p className="text-slate-900 font-medium">{data?.project_name}</p>
                                {/* )} */}
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Remedies</p>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800  text-sm font-medium">
                                    {data.deadline.requirement}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Deadline Information</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-500">Due Date</p>
                                    <p className="text-slate-900 font-medium">
                                        {data.deadline.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-500">Status</p>
                                    {(() => {
                                        const days = Number(data?.deadline?.daysRemaining);
                                        if (days < 0) {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-red-100 text-red-800  text-sm font-medium">
                                                    {Math.abs(days)} days overdue
                                                </span>
                                            );
                                        } else if (days === 0) {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800  text-sm font-medium">
                                                    Due today
                                                </span>
                                            );
                                        } else if (days <= 7) {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800  text-sm font-medium">
                                                    {days} days remaining (Urgent)
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-800  text-sm font-medium">
                                                    {days} days remaining
                                                </span>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-2 mb-3">
                            <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <h4 className="text-sm font-semibold text-blue-900">Recommended Next Steps</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-700 ml-6">
                            {(() => {
                                const days = Number(data?.deadline?.daysRemaining);


                                if (days < 0) {
                                    return (
                                        <>
                                            <li className="list-disc">Contact all parties immediately to address this overdue deadline</li>
                                            <li className="list-disc">Consult with legal counsel about potential remedies or extensions</li>
                                            <li className="list-disc">Document all attempts to comply and any extenuating circumstances</li>
                                        </>
                                    );
                                } else if (days <= 3) {
                                    return (
                                        <>
                                            <li className="list-disc">Finalize all required documents and verify accuracy</li>
                                            <li className="list-disc">Confirm delivery method and recipient contact information</li>
                                            <li className="list-disc">Prepare proof of delivery/filing for your records</li>
                                        </>
                                    );
                                } else if (days <= 7) {
                                    return (
                                        <>
                                            <li className="list-disc">Gather all necessary project documentation and supporting materials</li>
                                            <li className="list-disc">Review state-specific requirements and filing procedures</li>
                                            <li className="list-disc">Schedule time to prepare and review notices before submission</li>
                                        </>
                                    );
                                } else {
                                    return (
                                        <>
                                            <li className="list-disc">Review project details and verify all party information is current</li>
                                            <li className="list-disc">Set calendar reminder for 7 days before deadline</li>
                                            <li className="list-disc">Organize relevant contracts, invoices, and supporting documents</li>
                                        </>
                                    );
                                }
                            })()}
                        </ul>
                    </div>

                    {(() => {
                        const action = data?.deadline?.title.toLowerCase();
                        let tip = '';

                        if (action.includes('preliminary notice') || action.includes('prelim')) {
                            tip = 'Preliminary notices must be sent within statutory timeframes (typically 20 days from first furnishing labor or materials). Missing this deadline may affect your lien rights.';
                        } else if (action.includes('lien')) {
                            tip = 'Mechanic\'s liens must typically be filed within 90 days of project completion or last work performed. Verify your state\'s specific deadline requirements.';
                        } else if (action.includes('notice of intent')) {
                            tip = 'A Notice of Intent to Lien gives property owners advance warning and often motivates payment. Send it 10-20 days before filing an actual lien.';
                        } else if (action.includes('payment')) {
                            tip = 'Include detailed line items, supporting documentation, and reference your contract terms. Keep copies of all submitted payment applications.';
                        } else {
                            tip = 'Always send notices via certified mail or another trackable delivery method. Keep proof of delivery and copies of all sent documents.';
                        }

                        return tip && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-amber-900 mb-1">Important Note</h4>
                                        <p className="text-sm text-amber-800">{tip}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </DialogContent>
            <DialogActions>
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                    Cancel
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default DeadlineViewModal