import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Customer, CustomerContact, initialCustomer } from '../../types/customer';
import { useGetContactRolesQuery, useGetStatesQuery, useLazyGetAllContactCompaniesQuery } from '../../features/master/masterDataApi';
import { ProjectWizardData } from '../../types/project';
import { isValidEmail, isValidPhone } from '../../utils/validation';
import CompanyAutocomplete from '../../utils/CompanyAutocomplete';
import { useSubmitCustomerContactMutation } from '../../features/project/ProjectContactApi';
import AddSingleContactForm from './AddSingleContactForm';

interface AddCustomerModalProps {
    readonly isOpen: boolean;
    readonly data: ProjectWizardData;
    readonly onClose: () => void;
    readonly initialData?: Customer;
}

export default function AddCustomerModal({ isOpen, data, onClose, initialData }: AddCustomerModalProps) {

    const hasFetchedRef = useRef(false);
    const [customer, setCustomer] = useState<Customer>(initialData || initialCustomer);
    const [contactErrors, setContactErrors] = useState<
        Record<number, { email?: string; directPhone?: string; cell?: string; firstName?: string }>
    >({});

    const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
        { country_id: Number(data.countryId) },
        { skip: !data.countryId }
    );

    const { data: customerContactRoles } = useGetContactRolesQuery({
        type: "customer",
    });

    const [fetchCompanies, { data: companies }] =
        useLazyGetAllContactCompaniesQuery();

    const [
        submitCustomerContact,
        { isLoading: saveLoading },
    ] = useSubmitCustomerContactMutation();

    const updateCustomer = useCallback(
        (field: keyof Customer, value: any) => {
            setCustomer((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        customer.contacts.forEach((contact, index) => {
            if (contact.email && !isValidEmail(contact.email)) {
                errors[`contacts.${index}.email`] =
                    "Customer contact email must be valid.";
            }
            if (!contact.firstName || contact.firstName.length < 3) {
                errors[`contacts.${index}.firstName`] =
                    "Customer contact first name must be valid.";
            }
        });

        return Object.keys(errors).length === 0;
    };

    const hasContactErrors = Object.keys(contactErrors).length > 0;

    const isValid = customer.company && customer.address && customer.city && isValidPhone(customer.phone) && customer.state_id && customer.zip && validateForm() && customer.contacts.length && !hasContactErrors;

    const addContact = () => {
        const newContact: CustomerContact = {
            role_id: 1,
            firstName: '',
            lastName: '',
            email: '',
            directPhone: '',
            cell: '',
            is_new: true
        };
        setCustomer({
            ...customer,
            id: Date.now(),
            is_new: true,
            contacts: [newContact],
        });
    };

    const updateContact = (index: number, field: keyof CustomerContact, value: string | number) => {
        const updatedContacts = [...customer.contacts];
        updatedContacts[index] = { ...updatedContacts[index], [field]: value };
        setCustomer({ ...customer, contacts: updatedContacts });
    };

    const removeContact = (index: number) => {
        const updatedContacts = customer.contacts.filter((_, i) => i !== index);
        setCustomer({ ...customer, contacts: updatedContacts });
    }

    const handleSave = async () => {
        try {
            const response = await submitCustomerContact(customer).unwrap();
            if (response.status) {

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Customer Contact successfully",
                });
                setCustomer(initialCustomer);
                onClose();
            }

        } catch (err: any) {
            const errorResponse = err?.data;
            let errorMessage = "Something went wrong";
            if (errorResponse?.errors) {
                const firstErrorKey = Object.keys(errorResponse.errors)[0];
                errorMessage = errorResponse.errors[firstErrorKey][0];
            } else if (errorResponse?.message) {
                errorMessage = errorResponse.message;
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    const validateContactField = useCallback((
        index: number,
        field: "email" | "directPhone" | "cell" | "firstName",
        value: string
    ) => {
        setContactErrors((prev) => {
            const updated = { ...prev };

            if (!updated[index]) {
                updated[index] = {};
            }

            if (field === "email") {
                if (!value) {
                    updated[index].email = "Email is required.";
                } else if (!isValidEmail(value)) {
                    updated[index].email = "Invalid email format.";
                } else {
                    delete updated[index].email;
                }
            }

            if (field === "firstName") {
                if (value && (value).length < 4) {
                    updated[index][field] = "first name should be minimum 3 letters.";
                } else {
                    delete updated[index][field];
                }
            }

            if (field === "directPhone" || field === "cell") {
                if (value && !isValidPhone(value)) {
                    updated[index][field] = "Phone must be 10 digits.";
                } else {
                    delete updated[index][field];
                }
            }

            if (Object.keys(updated[index]).length === 0) {
                delete updated[index];
            }

            return updated;
        });
    }, []);

    useEffect(() => {
        if (isOpen && !hasFetchedRef.current) {
            fetchCompanies({ type: 'customer' });
            hasFetchedRef.current = true;
        }
        addContact();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Customer Contact</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">

                        <CompanyAutocomplete
                            companies={companies?.data}
                            customer={customer}
                            updateCustomer={updateCustomer}
                        />

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Website:
                            </label>
                            <input
                                type="text"
                                value={customer.website}
                                onChange={(e) => updateCustomer('website', e.target.value)}
                                placeholder="Enter Website"
                                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className='grid md:grid-cols-2 gap-6'>
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Address<span className="text-red-600">*</span>:
                            </label>
                            <textarea
                                value={customer.address}
                                onChange={(e) => updateCustomer('address', e.target.value)}
                                placeholder="Enter Address"
                                rows={5}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>
                        <div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 my-2">
                                    City<span className="text-red-600">*</span>:
                                </label>
                                <input
                                    type="text"
                                    value={customer.city}
                                    onChange={(e) => updateCustomer('city', e.target.value)}
                                    placeholder="Enter City"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 mt-4">
                                    State<span className="text-red-600">*</span>:
                                </label>
                                <select
                                    value={customer.state_id}
                                    onChange={(e) => updateCustomer('state_id', Number(e.target.value))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {isStatesLoading || isStatesFetching ? (
                                        <option value="">Loading states...</option>
                                    ) : (
                                        <>
                                            <option value="">Select State</option>
                                            {states?.data?.map((state) => (
                                                <option key={state.id} value={state.id}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Zip<span className="text-red-600">*</span>:
                            </label>
                            <input
                                type="text"
                                value={customer.zip}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateCustomer('zip', value);
                                }}
                                placeholder="Enter Zip Code"
                                maxLength={6}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone<span className="text-red-600">*</span>:
                            </label>
                            <input
                                type="text"
                                value={customer.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                    updateCustomer('phone', value)
                                }}
                                placeholder="Enter Phone Number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Fax:
                            </label>
                            <input
                                type="text"
                                value={customer.fax}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateCustomer('fax', value)
                                }}
                                placeholder="Enter Fax Number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        {/* <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold text-slate-700">Contacts:</label>
                            <button
                                onClick={addContact}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Contact
                            </button>
                        </div> */}

                        <AddSingleContactForm
                            customerContactRoles={customerContactRoles?.data ?? []}
                            contacts={customer?.contacts}
                            updateContact={updateContact}
                            contactErrors={contactErrors}
                            removeContact={removeContact}
                            validateContactField={validateContactField}
                            isMultiple={false}
                        />
                    </div>
                </div>

                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isValid || saveLoading}
                        className="disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Customer
                    </button>
                </div>
            </div>
        </div>
    );
}
