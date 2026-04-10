import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/validation';
import { COPY_RIGHT } from '../../utils/config';
import { AuthLeftPanel } from '../layout/auth/AuthLeftPanel';
import { PrimaryButton } from '../Button/PrimaryButton';
import { BUTTON_TEXT } from '../../types/button';
import BackBtn from '../Button/BackBtn';
import CancelButton from '../Button/CancelButton';

export default function ForgotPasswordScreen() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSuccess("Reset password link sent to your email");

            setTimeout(() => {
                navigate('/login');
            }, 2500);

        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">

            {/* Left Section: Branding & Info */}
            <AuthLeftPanel
                title="Secure access to your workspace."
                subtitle="Don't worry, it happens to the best of us. Enter your registered email and we'll help you get back on track."
                footer={<span>{COPY_RIGHT}</span>}
            />

            {/* Right Section: Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50/30">
                <div className="w-full max-w-[400px]">

                    {/* Header */}
                    <div className="mb-10 text-left">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 text-primary text-sm font-semibold mb-6 hover:gap-1 transition-all"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </button>
                        <h1 className="text-4xl font-semibold tracking-tight" >
                            Forgot Password
                        </h1>
                        <p className="text-textMuted mt-2">Enter your email to receive a reset link</p>
                    </div>

                    {/* Feedback Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="text-emerald-500 w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm text-emerald-700 font-medium leading-relaxed">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                className="text-sm font-bold ml-1"

                            >
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    required
                                    disabled={loading || !!success}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <PrimaryButton
                                type='submit'
                                label={BUTTON_TEXT.RESET_LINK}
                                loading={loading || !!success}
                                icon={<ArrowRight size={18} />}
                            />

                            <CancelButton label='Cancel' onClick={() => navigate('/login')} />
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}