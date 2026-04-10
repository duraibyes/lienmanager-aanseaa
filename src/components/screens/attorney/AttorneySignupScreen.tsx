import Swal from "sweetalert2";
import { Eye, EyeOff, Lock, Scale } from "lucide-react"
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import CompanyAutocompleteLien from "../../../utils/CompanyAutoCompleteLien";
import { useGetAllStatesQuery, useLazyGetAllCompaniesQuery } from "../../../features/master/masterDataApi";
import { validateEmail, validatePassword, validatePhoneNumber } from "../../../utils/validation";
import { useAppDispatch } from "../../../store/hooks";
import { useLienSignupMutation } from "../../../features/lienAuth/auth";
import { setCredentials } from "../../../features/auth/authSlice";
import { ROLES } from "../../../utils/constant";

export interface CompanyNew {
    id: string;
    company_name: string;
    company_phone: string | null;
    fax: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
}

export interface LienAdd {
    companyId: string,
    newCompanyName: string,
    companyPhone: string,
    fax: string,
    role: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    states: string[],
    zip: string,
    password?: string,
    confirmPassword?: string,
    profileImage?: File | null;
    id?: number;
}


const AttorneySignupScreen = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [signup] = useLienSignupMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);

    const [formData, setFormData] = useState<LienAdd>({
        companyId: '',
        newCompanyName: '',
        companyPhone: '',
        fax: '',
        role: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        states: [] as string[],
        zip: '',
        password: '',
        confirmPassword: '',
        profileImage: null
    });

    const { data: states, isFetching: isStatesFetching } = useGetAllStatesQuery();

    const [fetchCompanies, { data: companies, isFetching: isCompanyFetching }] =
        useLazyGetAllCompaniesQuery();

    const updateForm = useCallback(
        (field: keyof LienAdd, value: any) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const handleStateToggle = (state: string) => {
        setFormData(prev => ({
            ...prev,
            states: prev.states.includes(state)
                ? prev.states.filter(s => s !== state)
                : [...prev.states, state]
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSize = 2 * 1024 * 1024;

        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!validTypes.includes(file.type)) {

            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Please upload a valid image file (JPEG, JPG, or PNG)",
            });

            e.target.value = "";

            setProfileImage(null);

            return;
        }
        if (file.size > maxSize) {
            Swal.fire({
                icon: "error",
                title: "File Too Large",
                text: "Image must be less than 2MB",
            });

            e.target.value = "";
            setProfileImage(null);
            return;
        }

        setProfileImage(file);
    };

    const validateStates = (states: string[]): string | null => {
        if (!states || states.length === 0) {
            return "Please select at least one state";
        }
        return null;
    };

    const validateForm = (): boolean => {
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password ?? "");
        const companyPhoneError = validatePhoneNumber(formData.companyPhone);
        const phoneError = validatePhoneNumber(formData.phone);
        const stateError = validateStates(formData.states);

        if (emailError) setError(emailError);
        else if (passwordError) setError(passwordError);
        else if (companyPhoneError) setError(companyPhoneError);
        else if (phoneError) setError(phoneError);
        else if (stateError) setError(stateError);

        return (
            emailError === null &&
            passwordError === null &&
            companyPhoneError === null &&
            phoneError === null &&
            stateError === null
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);

        try {

            const payload = new FormData();

            if (formData.companyId) {
                payload.append("companyId", String(formData.companyId));
            }

            payload.append("newCompanyName", formData.newCompanyName);
            payload.append("companyPhone", formData.companyPhone);
            payload.append("fax", formData.fax);
            payload.append("role", formData.role);
            payload.append("firstName", formData.firstName);
            payload.append("lastName", formData.lastName);
            payload.append("email", formData.email);
            payload.append("phone", formData.phone);
            payload.append("address", formData.address);
            payload.append("city", formData.city);
            payload.append("zip", formData.zip);
            payload.append("password", formData.password ?? "");
            payload.append("password_confirmation", formData.confirmPassword ?? "");

            // states array
            formData.states.forEach((state) => {
                payload.append("states[]", state);
            });

            // image
            if (profileImage) {
                payload.append("profileImage", profileImage);
            }
            const res = await signup(payload).unwrap();
            dispatch(setCredentials(res));

        } catch (err: any) {
            if (err?.data?.errors) {
                const firstKey = Object.keys(err.data.errors)[0];
                setError(err.data.errors[firstKey][0]);
            } else if (err?.data?.message) {
                setError(err.data.message);
            } else {
                setError("Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <Scale className="w-10 h-10 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Lien Manager</h1>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create Account</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <CompanyAutocompleteLien isFetching={isCompanyFetching} companies={companies?.data || []} customer={formData} updateCustomer={updateForm} />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Phone
                                </label>
                                <input
                                    type="text"
                                    value={formData.companyPhone}
                                    onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fax
                                </label>
                                <input
                                    type="text"
                                    value={formData.fax}
                                    onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Role Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            >
                                <option value="">Select a role</option>
                                {ROLES.map(role => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP
                                </label>
                                <input
                                    type="text"
                                    value={formData.zip}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, "");
                                        setFormData({ ...formData, zip: value })
                                    }}
                                    maxLength={6}
                                    inputMode="numeric"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State (Multi-select) <span className="text-red-600">*</span>
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {isStatesFetching ? (<div className="col-span-full text-center text-gray-500">
                                            Loading States...
                                        </div>) : (
                                            states?.data?.map(state => (
                                                <label key={state.id} className="flex flex-wrap items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.states.includes(String(state?.id))}
                                                        onChange={() => handleStateToggle(String(state?.id))}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">{state?.name}</span>
                                                </label>
                                            ))
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Authentication Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Image (JPEG, JPG, PNG)
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            {profileImage && (
                                <p className="text-sm text-green-600 mt-2">
                                    Selected: {profileImage.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/attorney/login')}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Back to Login
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AttorneySignupScreen