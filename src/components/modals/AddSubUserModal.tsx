import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import { AlertCircle, X } from "lucide-react";
import { ProjectWizardData } from "../../types/project";
import { initialSubUserData, SubUser } from "../../types/user";
import { useGetStatesQuery } from "../../features/master/masterDataApi";
import { validateEmail, validatePassword } from "../../utils/validation";
import { useSubmitSubUserMutation } from "../../features/master/subUserDataApi";
import IconButton from "../Button/IconButton";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AddSubUserProps {
    readonly isOpen: boolean;
    readonly data: ProjectWizardData;
    readonly onClose: () => void;
    readonly initialData?: SubUser;
}

const AddSubUserModal = ({ isOpen, data, onClose, initialData }: AddSubUserProps) => {

    const [subuser, setSubuser] = useState<SubUser>(initialData || initialSubUserData);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        password_confirmation?: string;
    }>({});

    const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
        { country_id: Number(data.countryId) },
        { skip: !data.countryId }
    );

    const [
        submitSubUser,
        { isLoading: saveLoading },
    ] = useSubmitSubUserMutation();

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        const emailError = validateEmail(subuser.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(subuser.password);
        if (passwordError) newErrors.password = passwordError;

        if (subuser.password !== subuser.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const isValid =
        subuser.first_name &&
        subuser.city &&
        subuser.state_id &&
        subuser.zip_code !== '';

    const updateSubuser = useCallback(
        (field: keyof SubUser, value: any) => {
            setSubuser((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const handleSave = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!validateForm()) return;
        setIsLoading(true);
        setError('');
        if (subuser.password !== subuser.password_confirmation) {
            setError('Passwords do not match');
            return;
        } try {

            const response = await submitSubUser(subuser).unwrap();

            if (response.status) {

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Sub User saved successfully",
                });

                setSubuser(initialSubUserData);
                onClose();
                setIsLoading(false);

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
            setIsLoading(false);
        }

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh]">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-2 flex justify-between rounded-md items-center ">
                    <h2 className="text-xl font-bold text-slate-900">Sub User</h2>
                    <IconButton icon={X} onClick={onClose} />
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                First name<span className="text-red-600">*</span>:
                            </label>
                            <Input
                                type="text"
                                value={subuser.first_name}
                                onChange={(e) => updateSubuser('first_name', e.target.value)}
                                placeholder="Enter First name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Last name:
                            </label>
                            <Input
                                type="text"
                                value={subuser.last_name}
                                onChange={(e) => updateSubuser('last_name', e.target.value)}
                                placeholder="Enter Last name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Address:
                            </label>
                            <Input
                                value={subuser.address}
                                onChange={(e) => updateSubuser('address', e.target.value)}
                                placeholder="Enter Address"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone<span className="text-red-600">*</span>:
                            </label>
                            <Input
                                type="text"
                                value={subuser.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                    updateSubuser('phone', value)
                                }}
                                placeholder="Enter Phone Number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                City<span className="text-red-600">*</span>:
                            </label>
                            <Input
                                type="text"
                                value={subuser.city}
                                onChange={(e) => updateSubuser('city', e.target.value)}
                                placeholder="Enter City"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                State<span className="text-red-600">*</span>:
                            </label>
                            <select
                                value={subuser.state_id}
                                onChange={(e) => updateSubuser('state_id', Number(e.target.value))}
                                className="w-full px-4 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                                value={subuser.zip_code}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateSubuser('zip_code', value);
                                }}
                                placeholder="Enter Zip Code"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email<span className="text-red-600">*</span>:
                            </label>
                            <input
                                type="email"
                                autoComplete="new-email"
                                value={subuser.email}
                                onChange={(e) => updateSubuser('email', e.target.value)}
                                placeholder="Enter Email"
                                className={`w-full px-4 py-1.5 border rounded-lg 
      ${errors.email ? "border-red-500" : "border-slate-300"}
      focus:ring-4 focus:ring-primary/20 focus:border-primary focus:outline-none`}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Password <span className="text-red-600">*</span>:
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={subuser.password}
                                    onChange={(e) => updateSubuser('password', e.target.value)}
                                    className={`w-full px-4 py-1.5 border rounded-lg 
      ${errors.password ? "border-red-500" : "border-slate-300"}
      focus:ring-4 focus:ring-primary/20 focus:border-primary focus:outline-none`}
                                    placeholder="At least 6 characters"
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                                Confirm Password <span className="text-red-600">*</span>:
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="off"
                                    value={subuser.password_confirmation}
                                    onChange={(e) => updateSubuser('password_confirmation', e.target.value)}
                                    className={`w-full px-4 py-1.5 border rounded-lg 
      ${errors.password_confirmation ? "border-red-500" : "border-slate-300"}
      focus:ring-4 focus:ring-primary/20 focus:border-primary focus:outline-none`}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3 rounded-md">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !isValid || saveLoading} className="gradient-primary hover:opacity-90" onClick={handleSave}>
                        {saveLoading ? "Saving.." : "Save Sub User"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddSubUserModal