import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Customer, CustomerContact, initialCustomer } from '../../types/customer';
import { useGetContactRolesQuery, useGetStatesQuery, useLazyGetAllContactCompaniesQuery } from '../../features/master/masterDataApi';
import { ProjectWizardData } from '../../types/project';
import { isValidEmail, isValidPhone } from '../../utils/validation';
import CompanyAutocomplete from '../../utils/CompanyAutocomplete';
import { useSubmitProjectContactMutation } from '../../features/project/ProjectContactApi';
import AddSingleContactForm from './AddSingleContactForm';
import IconButton from '../Button/IconButton';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface AddProjectContactsModalProps {
    readonly isOpen: boolean;
    readonly data: ProjectWizardData;
    readonly onClose: () => void;
    readonly initialData?: Customer;
}

export default function AddProjectContactsModal({ isOpen, data, onClose, initialData }: AddProjectContactsModalProps) {
    const [customer, setCustomer] = useState<Customer>(initialData || initialCustomer);
    const [contactErrors, setContactErrors] = useState<
        Record<number, { email?: string; directPhone?: string; cell?: string, firstName?: string }>
    >({});

    const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
        { country_id: Number(data.countryId) },
        { skip: !data.countryId }
    );

    const { data: customerContactRoles } = useGetContactRolesQuery({
        type: "customer",
    });

    const { data: projectContactRoles, isFetching: isProjectContactRoleLoading } = useGetContactRolesQuery({
        type: "project",
    });

    const [fetchCompanies, { data: companies }] =
        useLazyGetAllContactCompaniesQuery();

    const [
        submitProjectContact,
        { isLoading: saveLoading },
    ] = useSubmitProjectContactMutation();

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
                    "Project contact email must be valid.";
            }
            if (!contact.firstName || contact.firstName.length < 3) {
                errors[`contacts.${index}.firstName`] =
                    "Customer contact first name must be valid.";
            }
        });

        return Object.keys(errors).length === 0;
    };

    const hasContactErrors = Object.keys(contactErrors).length > 0;

    const isValid = customer.company && customer.role_id && customer.city && isValidPhone(customer.phone) && customer.state_id && customer.zip && validateForm() && customer.contacts.length && !hasContactErrors;

    const addContact = () => {
        const newContact: CustomerContact = {
            role_id: 1,
            firstName: '',
            lastName: '',
            email: '',
            directPhone: '',
            cell: '',
        };
        setCustomer({
            ...customer,
            id: Date.now(),
            is_new: true,
            contacts: [...customer.contacts, newContact],
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
    };

    const handleSave = async () => {
        try {
            const response = await submitProjectContact(customer).unwrap();
            if (response.status) {

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Project Contact saved successfully",
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

    console.log(' customer ', customer);

    const validateContactField = (
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

            // clean empty index object
            if (Object.keys(updated[index]).length === 0) {
                delete updated[index];
            }

            return updated;
        });
    };

    useEffect(() => {
        if (isOpen) {
            fetchCompanies({ type: 'customer' });
            addContact();
        }
    }, [isOpen]);

    if (!isOpen) return null;
    console.log(' companies ', companies);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh]">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-2 flex justify-between items-center rounded-md">
                    <h2 className="text-xl font-bold text-slate-900">Project Contact</h2>

                    <IconButton icon={X} onClick={() => {
                        onClose();
                        setCustomer(initialCustomer);
                    }
                    } />
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Role<span className="text-red-600">*</span>:
                            </label>
                            <select
                                value={customer.role_id}
                                onChange={(e) => updateCustomer('role_id', Number(e.target.value))}
                                className="w-full px-4 py-1.5 border border-slate-300 rounded focus:ring-4 focus:ring-primary/20 focus:border-primary focus:outline-none"
                            >
                                {isProjectContactRoleLoading ? (
                                    <option value="">Loading roles...</option>
                                ) : (
                                    <>
                                        <option value="">Select Role</option>
                                        {projectContactRoles?.data?.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                        <CompanyAutocomplete
                            companies={companies?.data}
                            customer={customer}
                            updateCustomer={updateCustomer}
                        />

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Website:
                            </label>
                            <Input
                                type="text"
                                value={customer.website}
                                onChange={(e) => updateCustomer('website', e.target.value)}
                                placeholder="Enter Website"

                            />
                        </div>
                    </div>


                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Address:
                            </label>
                            <Input
                                value={customer.address}
                                onChange={(e) => updateCustomer('address', e.target.value)}
                                placeholder="Enter Address"

                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                City<span className="text-red-600">*</span>:
                            </label>
                            <Input
                                type="text"
                                value={customer.city}
                                onChange={(e) => updateCustomer('city', e.target.value)}
                                placeholder="Enter City"

                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                State<span className="text-red-600">*</span>:
                            </label>
                            <select
                                value={customer.state_id}
                                onChange={(e) => updateCustomer('state_id', Number(e.target.value))}
                                className="w-full px-4 py-1.5 border border-slate-300 rounded focus:ring-4 focus:ring-primary/20 focus:border-primary focus:outline-none"
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

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Zip<span className="text-red-600">*</span>:
                            </label>
                            <Input
                                type="text"
                                value={customer.zip}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateCustomer('zip', value);
                                }}
                                placeholder="Enter Zip Code"
                                maxLength={6}

                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone <span className="text-red-600">*</span>:
                            </label>
                            <Input
                                type="text"
                                value={customer.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                    updateCustomer('phone', value)
                                }}
                                placeholder="Enter Phone Number"

                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Fax:
                            </label>
                            <Input
                                type="text"
                                value={customer.fax}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateCustomer('fax', value)
                                }}
                                placeholder="Enter Fax Number"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
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

                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end rounded-md gap-3">
                    <Button variant="outline" onClick={() => {
                        onClose(); setCustomer(initialCustomer);
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid || saveLoading} className="gradient-primary hover:opacity-90" onClick={handleSave}>
                        {saveLoading ? "Saving.." : "Save Customer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
