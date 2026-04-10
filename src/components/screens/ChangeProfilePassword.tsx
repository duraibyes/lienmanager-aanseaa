import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { validatePassword } from "../../utils/validation";
import { useUpdatePasswordMutation } from "../../features/lienAuth/profileApi";
import { useAppDispatch } from "../../store/hooks";
import { setView } from "../../store/slices/viewSlice";
import { logout } from "../../features/auth/authSlice";
import ModalCloseBtn from "../Button/ModalCloseBtn";

const ChangeProfilePassword = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [error, setError] = useState('');
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const validateForm = (): boolean => {
        const passwordError = validatePassword(passwordForm.newPassword);
        const confirmPasswordError = validatePassword(passwordForm.confirmPassword);

        return passwordError === null && confirmPasswordError === null;
    };

    const isFormValid =
        passwordForm.newPassword.length >= 8 &&
        passwordForm.confirmPassword.length >= 8 &&
        validateForm();

    const handleSignOut = useCallback(() => {
        dispatch(setView(null));
        dispatch(logout());
        navigate("/");
    }, []);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordError = validatePassword(passwordForm.newPassword);
        const confirmPasswordError = validatePassword(passwordForm.confirmPassword);

        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (confirmPasswordError) {
            setError(confirmPasswordError);
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await updatePassword({
                current_password: passwordForm.currentPassword,
                password: passwordForm.newPassword,
                password_confirmation: passwordForm.confirmPassword,
            }).unwrap();

            if (res.logout) {
                handleSignOut();
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Password changed successfully, Try to relogin",
                    timer: 1500,
                    showConfirmButton: false,
                    target: document.body,
                    didOpen: () => {
                        const container = document.querySelector('.swal2-container') as HTMLElement;
                        if (container) {
                            container.style.zIndex = '2000';
                        }
                    }
                });
            }

        } catch (err: any) {
            if (err?.data?.errors) {
                const firstKey = Object.keys(err.data.errors)[0];
                setError(err.data.errors[firstKey][0]);
            } else {
                setError(err?.data?.message || "Failed to update password");
            }
        }
    };

    return (
        <Dialog
            open={show}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle className="flex items-center justify-between">
                Change Password
                <ModalCloseBtn onClose={onClose} />
            </DialogTitle>

            <DialogContent className="space-y-5">

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
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
                            Confirm New Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
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

                    <div className="mt-2 text-sm space-y-1">
                        <p className={`flex items-center gap-2 text-gray-500`}>
                            * At least 8 characters
                        </p>
                        <p className={`flex items-center gap-2 text-gray-500`}>
                            * Contains numbers
                        </p>

                        <p className={`flex items-center gap-2 text-gray-500`}>
                            * Contains letters
                        </p>
                    </div>
                    <DialogActions className="px-6 pb-4">
                        <div className="w-full mb-4 space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    setPasswordForm({ newPassword: '', confirmPassword: '', currentPassword: '' });
                                    setShowPassword(false);
                                    setShowConfirmPassword(false);
                                }}
                                className="w-full sm:w-1/2 py-3 border border-gray-300 text-gray-700 rounded-md bg-white hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className={`w-full sm:w-1/2 py-3 rounded-md text-white transition ${isFormValid
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Update Password
                            </button>
                        </div>
                    </DialogActions>
                </form>

            </DialogContent >
        </Dialog >
    )
}

export default ChangeProfilePassword