import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import ModalCloseBtn from "../../Button/ModalCloseBtn";
import { useGetStatesQuery } from "../../../features/master/masterDataApi";
import { ProfileAdd } from "../../../types/customer";
import { useUpdateProfileMutation } from "../../../features/lienAuth/profileApi";
import { ProfileData } from "../../../types/liens";
type ProfileProps = {
    show: boolean;
    onClose: () => void;
    data: ProfileData | null;
    refetch: () => void;
};

const UpdateProfileModal = ({ show, onClose, data, refetch }: ProfileProps) => {
    const title = "Update Profile Information";

    const [profileImage, setProfileImage] = useState<File | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileAdd>({
        companyId: 0,
        newCompanyName: '',
        fax: '',
        role: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        stateId: 0,
        zip: '',
        profileImage: null,
        website: '',
    });

    const [updateProfile] = useUpdateProfileMutation();

    const country_id = 1;


    const profile = data;

    const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
        { country_id: Number(country_id) },
        { skip: !country_id }
    );

    const updateForm = useCallback(
        (field: keyof ProfileAdd, value: any) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone must be 10 digits";
        }

        if (!formData.address) {
            newErrors.address = "Address is required";
        }

        if (!formData.city) {
            newErrors.city = "City is required";
        }

        if (!formData.stateId) {
            newErrors.stateId = "State is required";
        }

        if (!formData.zip) {
            newErrors.zip = "Zip is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
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

    const isValid =
        formData.firstName &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '') &&
        /^[0-9]{10}$/.test(formData.phone);

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const payload = new FormData();
            if (formData.companyId) {
                payload.append("company_id", String(formData.companyId));
            }
            payload.append("company_name", formData.newCompanyName);
            payload.append("fax", formData.fax);
            payload.append("first_name", formData.firstName);
            payload.append("last_name", formData.lastName);
            payload.append("phone", formData.phone);
            payload.append("address", formData.address);
            payload.append("state_id", String(formData.stateId));
            payload.append("city", formData.city);
            payload.append("zip_code", formData.zip);
            payload.append("website", formData.website);

            if (profileImage) {
                payload.append("image", profileImage);
            }

            const res = await updateProfile(payload).unwrap();

            if (res.status) {
                onClose();
                await refetch();
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Profile updated successfully",
                    timer: 1500,
                    showConfirmButton: false,
                });

            }

            setErrors({});
        } catch (err: any) {
            console.log('err', err);

            if (err?.data?.errors) {
                const apiErrors = err.data.errors;

                const formattedErrors: Record<string, string> = {};

                Object.keys(apiErrors).forEach((key) => {
                    formattedErrors[key] = apiErrors[key][0];
                });

                setErrors(formattedErrors);
            } else {
                setErrors({
                    general: err?.data?.message || "Something went wrong"
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile && show) {
            setFormData({
                companyId: profile?.company?.id || 0,
                newCompanyName: profile?.company?.company || '',
                fax: profile?.company?.fax || '',
                firstName: profile.user_details?.first_name || '',
                lastName: profile.user_details?.last_name || '',
                email: profile.user.email || '',
                phone: profile.user_details?.phone || '',
                address: profile.user_details?.address || '',
                website: profile.company?.website || '',
                city: profile.user_details?.city || '',
                stateId: profile?.user_details?.state_id || 0,
                zip: profile.user_details?.zip_code || '',
                profileImage: null
            });
        }
    }, [profile, show]);

    return (
        <Dialog
            open={show}
            onClose={
                onClose
            }
            maxWidth="md"
            fullWidth
            keepMounted
        >
            <DialogTitle className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
                    <ModalCloseBtn onClose={onClose} />
                </div>
            </DialogTitle>

            <DialogContent className="px-4 sm:px-6">
                <div className="py-2">
                    {errors.general && (
                        <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
                            {errors.general}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                First name<span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => updateForm('firstName', e.target.value)}
                                placeholder="Enter First name"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? "border-red-500" : "border-slate-300"
                                    }`}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Last name
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => updateForm('lastName', e.target.value)}
                                placeholder="Enter Last name"
                                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Company<span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.newCompanyName}
                                disabled={formData.companyId !== 0}
                                onChange={(e) => updateForm('newCompanyName', e.target.value)}
                                placeholder="Enter Company name"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? "border-red-500" : "border-slate-300"
                                    }`}
                            />
                            {errors.newCompanyName && (
                                <p className="text-red-500 text-xs mt-1">{errors.newCompanyName}</p>
                            )}
                        </div>

                        <div >
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Website
                            </label>
                            <input
                                type="text"
                                value={formData.website}
                                onChange={(e) => updateForm('website', e.target.value)}
                                placeholder="http://example.com"
                                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent  ${errors.website ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.website && (
                                <p className="text-red-500 text-xs mt-1">{errors.website}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                onChange={(e) => updateForm('email', e.target.value)}
                                placeholder="xyz@mail.com"
                                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Profile image
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                    </div>
                    <div className='grid md:grid-cols-2 gap-6 mt-4'>
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Address<span className="text-red-600">*</span>:
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => updateForm('address', e.target.value)}
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
                                    value={formData.city}
                                    onChange={(e) => updateForm('city', e.target.value)}
                                    placeholder="Enter City"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 mt-4">
                                    State<span className="text-red-600">*</span>:
                                </label>
                                <select
                                    value={formData.stateId}
                                    onChange={(e) => updateForm('stateId', Number(e.target.value))}
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

                    <div className="grid md:grid-cols-3 gap-6 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Zip<span className="text-red-600">*</span>:
                            </label>
                            <input
                                type="text"
                                value={formData.zip}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateForm('zip', value);
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
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                    updateForm('phone', value)
                                }}
                                placeholder="Enter Phone Number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Fax:
                            </label>
                            <input
                                type="text"
                                value={formData.fax}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateForm('fax', value)
                                }}
                                placeholder="Enter Fax Number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>

            <DialogActions className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-col sm:flex-row justify-end gap-2 w-full px-4 py-2">

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-slate-300"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                </div>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProfileModal;
