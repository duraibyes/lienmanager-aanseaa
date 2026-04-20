import { Trash2, Mail } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { ProjectWizardData, Task } from '../../../types/project';
import { useGetTaskActionsQuery, useGetTasksQuery } from '../../../features/task/taskDataApi';
import { useGetSubUsersQuery } from '../../../features/master/subUserDataApi';
import AddSubUserModal from '../../modals/AddSubUserModal';
import OutlinePrimaryIcon from '@/components/Button/OutlinePrimaryIcon';
import { Button } from '@/components/ui/button';

interface TasksStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onNext?: () => void;
    readonly onBack?: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function TasksStep({ data, onUpdate }: TasksStepProps) {
    const initializedRef = useRef(false);

    const [isOpen, setIsOpen] = useState(false);
    const { data: actionRes } = useGetTaskActionsQuery();
    const [openForm, setOpenForm] = useState(false);
    const { data: subUserRes, isFetching: isSubuserFetching } = useGetSubUsersQuery();

    const [newTask, setNewTask] = useState<Partial<Task>>({
        actionId: 0,
        action: '',
        assignedId: 0,
        assignedTo: '',
        otherName: '',
        dueDate: '',
        emailAlert: false,
        comment: '',
    });

    const { data: taskData } = useGetTasksQuery({
        page: 1,
        per_page: 100,
        sort_by: "created_at",
        sort_dir: "desc",
        project_id: data?.projectId,
    });

    const isAddDisabled = useMemo(() => {
        if (!newTask.dueDate) return true;

        if (!newTask.assignedId || newTask.assignedId === 0) return true;

        if (newTask.actionId === 0) {
            if (!newTask.otherName?.trim()) return true;
        } else {
            if (!newTask.actionId) return true;
        }

        return false;
    }, [newTask]);


    const addTask = () => {

        const task: Task = {
            id: Date.now().toString(),
            action: newTask.action || '',
            actionId: newTask.actionId,
            dueDate: newTask.dueDate || '',
            emailAlert: newTask.emailAlert || false,
            comment: newTask.comment || '',
            otherName: newTask.otherName || '',
            assignedId: newTask.assignedId,
            assignedTo: newTask.assignedTo,
            isNew: true,
        };

        onUpdate({ tasks: [...data.tasks, task] });

        setNewTask({
            actionId: 0,
            action: '',
            dueDate: '',
            emailAlert: false,
            comment: '',
            otherName: '',
            assignedId: 0,
            assignedTo: ''
        });
        setOpenForm(false);
    };

    const cancelForm = useCallback(() => {
        setOpenForm(false);
        setNewTask({
            actionId: 0,
            action: '',
            dueDate: '',
            emailAlert: false,
            comment: '',
            otherName: '',
            assignedId: 0,
            assignedTo: ''
        });
    }, []);

    const removeTask = async (taskId: string) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete task?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mx-2",

                cancelButton:
                    "bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2",
            },
        });

        if (result.isConfirmed) {
            onUpdate({ tasks: data.tasks.filter(t => t.id !== taskId), removedTasks: [...data.removedTasks, taskId] });
        }
    };

    useEffect(() => {

        if (taskData?.data?.data && data?.projectId && !initializedRef.current) {

            const mappedTasks: Task[] = taskData.data?.data?.map((task: any) => ({
                id: task.id.toString(),
                actionId: task.task_action_id,
                action: task.task_name,
                assignedId: task.assigned_to,
                assignedTo: task?.assigned_to_user?.name,
                dueDate: task.due_date,
                emailAlert: task.email_alert === "1",
                comment: task.comment,
                otherName: "",
                isNew: false,
            }));

            onUpdate({ tasks: mappedTasks });

            initializedRef.current = true;
        }

    }, [taskData, data?.projectId]);

    return (
        <div className="">

            <div id="accordion-card" data-accordion="collapse">
                <h2 id="accordion-card-heading-1">
                    <button type="button" onClick={() => setOpenForm(!openForm)} className="flex items-center bg-primary/10 justify-between w-full p-5 font-medium rtl:text-right text-body rounded-base shadow-xs border border-primary hover:text-heading hover:bg-neutral-secondary-medium gap-3 [&[aria-expanded='true']]:rounded-b-none [&[aria-expanded='true']]:shadow-none" data-accordion-target="#accordion-card-body-1" aria-expanded="true" aria-controls="accordion-card-body-1">
                        <span>Add New Task</span>
                        <svg data-accordion-icon className="w-5 h-5 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7" /></svg>
                    </button>
                </h2>
                {openForm &&
                    <div id="accordion-card-body-1" className="border border-t-0 border-default rounded-b-base shadow-xs" aria-labelledby="accordion-card-heading-1">
                        <div className="p-4 md:p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className='flex items-center justify-between mb-2'>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2 py-1">
                                            Task Action <span className="text-red-600">*</span>
                                        </label>
                                    </div>
                                    <div className="relative">

                                        <select
                                            value={newTask.actionId}
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);

                                                const selectedAction = actionRes?.data?.find(
                                                    (a) => a.id === selectedId
                                                );

                                                setNewTask({
                                                    ...newTask,
                                                    actionId: selectedId,
                                                    action:
                                                        selectedId === -1
                                                            ? 'Other'
                                                            : selectedAction?.name || '',
                                                });
                                            }}
                                            className="w-full px-4 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none focus:border-primary"
                                        >
                                            <option value="0">Select Action</option>
                                            {actionRes?.data?.map((action) => (
                                                <option key={action.id} value={action.id}>{action.name}</option>
                                            ))}
                                            <option value={-1}>Other</option>
                                        </select>
                                    </div>

                                </div>
                                {newTask.actionId === -1 && (

                                    <div className="">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3 py-1">
                                            Action <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Send preliminary notice"
                                            value={newTask.otherName}
                                            onChange={(e) => setNewTask({ ...newTask, otherName: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                )}

                                <div>
                                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                                        <label className="block text-sm font-semibold text-slate-700 ">
                                            Assigned To <span className="text-red-600">*</span>
                                        </label>
                                        <OutlinePrimaryIcon label=' Add Task Assignee' onClickFunction={() => setIsOpen(true)} />
                                    </div>
                                    <select
                                        value={newTask.assignedId}
                                        onChange={(e) => {
                                            const assignedId = Number(e.target.value);

                                            const selectedAction = subUserRes?.data?.find(
                                                (a) => a.id === assignedId
                                            );

                                            setNewTask({
                                                ...newTask,
                                                assignedId: assignedId,
                                                assignedTo: selectedAction?.name || ''
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none focus:border-primary"
                                        disabled={!data.countryId}
                                    >
                                        {isSubuserFetching ? (
                                            <option value="">Loading Sub user...</option>
                                        ) : (
                                            <>
                                                <option value="">Select Sub user</option>
                                                {subUserRes?.data?.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>

                                </div>

                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3 py-1">
                                            Due Date <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newTask.emailAlert}
                                                onChange={(e) => setNewTask({ ...newTask, emailAlert: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-primary/40 focus:outline-none focus:border-primary"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">Email Alert</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Comment
                                    </label>
                                    <textarea
                                        placeholder="Add notes or additional details..."
                                        value={newTask.comment}
                                        onChange={(e) => setNewTask({ ...newTask, comment: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className='flex items-center justify-end gap-4'>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={cancelForm}
                                    className="gap-1.5"
                                >
                                    <span className="hidden sm:inline">Cancel</span>
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={addTask}
                                    disabled={isAddDisabled}
                                    className={`gap-1.5 ${isAddDisabled ? "bg-gray-400" : "bg-primary"} text-primary-foreground hover:bg-primary/90`}
                                >
                                    <span>Add Task</span>
                                </Button>
                            </div>


                        </div>
                    </div>
                }

            </div>


            <div className="bg-white rounded-xl border border-slate-200 mt-3 p-4 sm:p-6 md:p-8">

                {data.tasks.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {data.tasks.map((task) => (
                            <div
                                key={task.id}
                                className="relative p-5 rounded-2xl border border-slate-200 
          bg-gradient-to-br from-white to-slate-50 
          shadow-sm hover:shadow-md transition-all duration-200"
                            >

                                {/* Top Accent */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-2xl" />

                                {/* Action */}
                                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                                    {task.otherName || task.action}
                                </h3>

                                {/* Due Date */}
                                <p className="text-xs text-slate-500 mt-1">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>

                                {/* Assigned */}
                                <div className="mt-3 text-sm">
                                    <span className="text-slate-500">Assigned to:</span>
                                    <p className="font-medium text-slate-800 truncate">
                                        {task.assignedTo}
                                    </p>
                                </div>

                                {/* Comment */}
                                <div className="mt-2 text-sm">
                                    <span className="text-slate-500">Comment:</span>
                                    <p className="text-slate-700 line-clamp-2">
                                        {task.comment || "-"}
                                    </p>
                                </div>

                                {/* Bottom Section */}
                                <div className="mt-4 flex items-center justify-between">

                                    {/* Email Icon */}
                                    <div>
                                        {task.emailAlert ? (
                                            <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">No Email</span>
                                        )}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeTask(task.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <p className="text-slate-600">
                            No tasks added yet. Create your first task above.
                        </p>
                    </div>
                )}
            </div>

            <AddSubUserModal isOpen={isOpen} data={data} onClose={() => setIsOpen(false)} />
        </div >
    );
}
