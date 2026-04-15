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
                    <div className="bg-primary/10 rounded-lg p-4">
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

                    <div className="bg-primary/10 rounded-lg p-4">
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
                                            <li className="list-disc">Take immediate action to resolve this missed deadline and minimize impact</li>
                                            <li className="list-disc">Evaluate available options, including legal guidance if required</li>
                                            <li className="list-disc">Maintain records of all communications and efforts taken after the deadline</li>
                                        </>
                                    );
                                } else if (days <= 3) {
                                    return (
                                        <>
                                            <li className="list-disc">Complete and double-check all required documents for accuracy</li>
                                            <li className="list-disc">Verify recipient details and ensure delivery method is ready</li>
                                            <li className="list-disc">Arrange proper tracking or confirmation for submission</li>
                                        </>
                                    );
                                } else if (days <= 7) {
                                    return (
                                        <>
                                            <li className="list-disc">Prepare all necessary documents and supporting information</li>
                                            <li className="list-disc">Review applicable rules and filing requirements</li>
                                            <li className="list-disc">Allocate time to finalize and validate everything before submission</li>
                                        </>
                                    );
                                } else {
                                    return (
                                        <>
                                            <li className="list-disc">Check project details and ensure all information is up to date</li>
                                            <li className="list-disc">Plan ahead by setting reminders before the deadline</li>
                                            <li className="list-disc">Organize key documents such as contracts and invoices</li>
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
                            tip = 'Preliminary notices should be issued within required timelines (commonly within 20 days of starting work). Delays may limit or affect your lien rights.';
                        } else if (action.includes('lien')) {
                            tip = 'Mechanic’s liens generally need to be filed within a specific period (often around 90 days after last work or project completion). Always confirm local regulations.';
                        } else if (action.includes('notice of intent')) {
                            tip = 'Sending a Notice of Intent to Lien can encourage timely payment. It is typically recommended to send it a few weeks before filing the lien.';
                        } else if (action.includes('payment')) {
                            tip = 'Ensure payment requests include clear breakdowns, supporting documents, and contract references. Maintain records of all submissions.';
                        } else {
                            tip = 'Use reliable delivery methods such as certified or trackable services. Always retain proof of delivery and copies for future reference.';
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
                    className="w-full sm:w-auto px-6 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                >
                    Cancel
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default DeadlineViewModal