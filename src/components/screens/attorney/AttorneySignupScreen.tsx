import Swal from "sweetalert2";
import { Eye, EyeOff, Lock, Scale, ArrowRight, Home, Mail, Phone, MapPin, Building, User } from "lucide-react"
import { useCallback, useEffect, useState } from "react";
import { AuthLeftAttorneyPanel } from '../../layout/auth/AuthLeftAttorneyPanel';
import { useNavigate } from "react-router-dom"
import CompanyAutocompleteLien from "../../../utils/CompanyAutoCompleteLien";
import { useGetAllStatesQuery, useLazyGetAllCompaniesQuery } from "../../../features/master/masterDataApi";
import { validateEmail, validatePassword, validatePhoneNumber } from "../../../utils/validation";
import { useAppDispatch } from "../../../store/hooks";
import { useLienSignupMutation } from "../../../features/lienAuth/auth";
import { setCredentials } from "../../../features/auth/authSlice";
import { ROLES } from "../../../utils/constant";
import { Button } from '../../ui/button';
import ErrorBox from '../../Parts/ErrorBox';

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
        <div className="h-screen flex font-serif">
            <AuthLeftAttorneyPanel />

            <div className="w-full lg:w-1/2 bg-background">
                <div className="flex items-center justify-center p-6 md:p-12 min-h-screen">
                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4 sm:p-8 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg gradient-primary glow-primary mb-3">
                            <Scale className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground text-center">Register your account</h2>
                        <p className="text-muted-foreground text-center text-sm sm:text-base mt-1">Become part of our legal practice platform</p>
                    </div>

                    {error && <ErrorBox error={error} />}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                Company Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CompanyAutocompleteLien isFetching={isCompanyFetching} companies={companies?.data || []} customer={formData} updateCustomer={updateForm} />

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Company Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyPhone}
                                        onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="Enter company phone"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Fax
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fax}
                                        onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="Enter fax number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Role Information
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">
                                    Role <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
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

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">
                                        First Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">
                                        Last Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="Enter last name"
                                        required
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1 sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Address
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows={3}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white resize-none"
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">
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
                                        className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                        placeholder="Enter ZIP"
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold ml-1">
                                        State (Multi-select) <span className="text-red-600">*</span>
                                    </label>
                                    <div className="border border-slate-200 rounded-xl p-4 max-h-48 overflow-y-auto bg-white">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                            {isStatesFetching ? (
                                                <div className="col-span-full text-center text-gray-500">
                                                    Loading States...
                                                </div>
                                            ) : (
                                                states?.data?.map(state => (
                                                    <label key={state.id} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.states.includes(String(state?.id))}
                                                            onChange={() => handleStateToggle(String(state?.id))}
                                                            className="w-4 h-4 text-primary rounded focus:ring-primary"
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

                        {/* Authentication Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Authentication Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">
                                        Password <span className="text-red-600">*</span>
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 focus:text-primary"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">
                                        Confirm Password <span className="text-red-600">*</span>
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 focus:text-primary"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile Image
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">
                                    Upload Image (JPEG, JPG, PNG)
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImageChange}
                                    className="w-full pl-4 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                />
                                {profileImage && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected: {profileImage.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            {/* <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                size="lg"
                                onClick={() => navigate('/attorney/login')}
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Back to Login
                            </Button> */}

                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <button
                                    onClick={() => navigate('/attorney/login')}
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}


export default AttorneySignupScreen