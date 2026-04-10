import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import { useCallback, useEffect, useRef, useState } from "react";
import { Customer, CustomerContact, initialCustomer } from "../../types/customer";
import { useGetContactRolesQuery, useGetStatesQuery, useLazyGetAllContactCompaniesQuery } from "../../features/master/masterDataApi";
import { useSubmitCustomerContactMutation } from "../../features/project/ProjectContactApi";
import { isValidEmail, isValidPhone } from "../../utils/validation";
import CompanyAutocomplete from "../../utils/CompanyAutocomplete";
import AddSingleContactForm from "./AddSingleContactForm";
import ModalCloseBtn from "../Button/ModalCloseBtn";

const AddContactModal = ({ isOpen, onClose, editData }: { isOpen: boolean; onClose: () => void, editData?: any }) => {
    const hasFetchedRef = useRef(false);
    const [customer, setCustomer] = useState<Customer>(initialCustomer);
    const [contactErrors, setContactErrors] = useState<
        Record<number, { email?: string; directPhone?: string; cell?: string; firstName?: string }>
    >({});

    const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
        { country_id: 1 },
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
        };
        setCustomer({
            ...customer,
            id: Date.now(),
            contacts: [newContact],
            is_new: true
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
                    timer: 3000,
                    text: "Contact saved successfully",
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
                if (!value) {
                    updated[index].firstName = "First Name is required.";
                } else {
                    delete updated[index].firstName;
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
        if (editData) {

            const newContact: CustomerContact = {
                role_id: editData.role_id ?? null,
                firstName: editData.first_name ?? null,
                lastName: editData.last_name ?? null,
                email: editData.email ?? null,
                directPhone: editData.direct_phone ?? null,
                cell: editData.cell ?? null,
                id: editData.contact_id ?? null
            };
            setCustomer({
                ...customer,
                id: editData.id ?? Date.now(),
                company: editData.company_name ?? null,
                companyId: editData.companyId ?? null,
                website: editData.website ?? null,
                address: editData.address ?? null,
                city: editData.city ?? null,
                zip: editData.zip ?? null,
                state_id: editData.state_id ?? null,
                fax: editData.fax ?? null,
                phone: editData.phone ?? null,
                state: editData.state ?? null,
                contacts: [newContact],
                is_new: false
            });

        } else {
            addContact()
        }
    }, [isOpen, editData]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {editData ? 'Update' : 'Add'} Customer Contact
                <ModalCloseBtn onClose={onClose} />
            </DialogTitle>

            <DialogContent>
                <div className="md:p-6 space-y-4 md:space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <CompanyAutocomplete
                            companies={companies?.data || []}
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
                                placeholder="https://www.example.com"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Address:
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

                                <label className="block text-sm font-semibold text-slate-700 mb-2 mt-2">
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
                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                                Phone <span className="text-red-600">*</span>:
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
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold text-slate-700">Contacts:</label>
                            {/* <button
                                onClick={addContact}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Contact
                            </button> */}
                        </div>

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
            </DialogContent>

            {/* Actions */}
            <DialogActions>
                <button onClick={onClose} className="px-6 py-2.5 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors">
                    Cancel
                </button>
                <button onClick={handleSave} className="disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!isValid || saveLoading}>
                    {saveLoading ? "Saving..." : "Save"}
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default AddContactModal