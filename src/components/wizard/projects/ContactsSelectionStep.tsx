import { useCallback, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Plus, User, Check, Building2 } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { Customer } from '../../../types/customer';
import AddCustomerModal from '../../modals/AddCustomerModal';
import AddProjectContactsModal from '../../modals/AddProjectContactsModal';
import { useGetProjectContactsQuery, useUploadCustomerExcelMutation } from '../../../features/project/ProjectContactApi';
import WizardFooterButton from '../../Button/WizardFooterButton';

interface ContactsSelectionStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function ContactsSelectionStep({ data, onUpdate, onNext, onBack, onSaveAndExit }: ContactsSelectionStepProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [uploadCustomerExcel, { isLoading }] =
        useUploadCustomerExcelMutation();
    console.log(' customers ', customers)
    const { data: projectContactData, isFetching: isProjectContactDataFetching } = useGetProjectContactsQuery();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadCustomerExcel(formData).unwrap();
            setCustomers(response.data);
            if (response.status) {

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Project saved successfully",
                });

            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed");
        }

        e.target.value = "";
    };

    const handleSelectCustomer = useCallback((selectedId: number) => {
        onUpdate({
            selectedCustomerContacts: selectedId
        });
    }, []);

    const toggleContact = (contactId: number) => {
        const selectedContacts: number[] = data.selectedProjectContacts ?? [];

        const isAlreadySelected = selectedContacts.includes(contactId);

        const updatedContacts = isAlreadySelected
            ? selectedContacts.filter((id) => id !== contactId)
            : [...selectedContacts, contactId];

        onUpdate({ selectedProjectContacts: updatedContacts });
    };

    const isContactSelected = (contactId: number): boolean => {
        return data.selectedProjectContacts?.some(
            (contact) => contact === contactId
        ) ?? false;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-3">Edit Contacts</h1>
                <p className="text-sm md:text-lg text-slate-600">
                    Choose customer and contacts involved in this project.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-8">
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <h3 className="text-lg font-bold text-blue-600">
                            Customer Information
                        </h3>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <a
                                href="/sample_customer_contacts.xlsx"
                                download
                                className="text-blue-600 underline"
                            >
                                Download Sample File
                            </a>

                            <button
                                onClick={handleUploadClick}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Upload Customer
                            </button>

                            <input
                                type="file"
                                accept=".xls,.xlsx,.csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                    {projectContactData?.customerContact.length === 0 || isLoading ? (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 mb-4">
                            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            {isLoading ? <p className="text-slate-600 font-medium mb-1"> Uploading... </p> :
                                (<>
                                    <p className="text-slate-600 font-medium mb-1">No customers found</p>
                                    <p className="text-sm text-slate-500">Click "Add New Customer" to get started</p>
                                </>)}
                        </div>
                    ) : (
                        <select
                            value={data?.selectedCustomerContacts}
                            onChange={(e) => handleSelectCustomer(Number(e.target.value))}
                            className="w-full px-4 py-3 mt-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        >
                            <option value="">Select a customer</option>
                            {projectContactData?.customerContact.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.company} ({customer.contacts[0].firstName})
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={() => setShowCustomerModal(true)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Add New Customer
                    </button>

                </div>

                <div className="border-t border-slate-200 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 text-center sm:text-left">Project Contacts</h3>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 
               bg-blue-600 text-white rounded-lg hover:bg-blue-700 
               transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Contact
                        </button>
                    </div>

                    {isProjectContactDataFetching ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-600">Loading contacts...</p>
                        </div>
                    ) : (
                        <>
                            {projectContactData?.projectContact?.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-lg">
                                    <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600 mb-2">No contacts found</p>
                                    <p className="text-sm text-slate-500">Click "Add New Contact" to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {projectContactData?.projectContact.map((contact) => (
                                        <button
                                            key={contact.id}
                                            onClick={() => toggleContact(Number(contact.id))}
                                            className={`
                  w-full p-4 border-2 rounded-lg cursor-pointer transition-all text-left
                  ${isContactSelected(Number(contact.id))
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }
                `}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                            w-6 h-6  flex-shrink-0 rounded-full border-2 flex items-center justify-center
                            ${isContactSelected(Number(contact.id))
                                                                ? 'border-blue-600 bg-blue-600'
                                                                : 'border-slate-300'
                                                            }
                        `}>
                                                            {isContactSelected(Number(contact.id)) && <Check className="w-4 h-4 text-white" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{contact.company}</h4>
                                                            <p className="text-sm text-slate-600">
                                                                {contact.address} {contact.city} {contact.zip}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-9 mt-2 text-sm text-slate-600">
                                                        {contact?.contacts?.map((con: any) => (
                                                            <>
                                                                <div>{con.firstName} {con.lastName}</div>
                                                                {con.directPhone && <div>{con.directPhone}</div>}
                                                                {con.email && <div>{con.email}</div>}
                                                            </>
                                                        )

                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {data.selectedProjectContacts && data.selectedProjectContacts.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-semibold text-green-900">
                                {data.selectedProjectContacts.length} contact(s) selected for this project
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <WizardFooterButton
                onBack={onBack}
                onSaveAndExit={onSaveAndExit}
                onNext={onNext}
            />

            <AddCustomerModal
                isOpen={showCustomerModal}
                data={data}
                onClose={() => setShowCustomerModal(false)}
            />

            <AddProjectContactsModal
                isOpen={showAddForm}
                data={data}
                onClose={() => setShowAddForm(false)}
            />
        </div>
    );
}
