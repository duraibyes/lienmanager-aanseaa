import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/validation';
import { AuthLeftPanel } from '../layout/auth/AuthLeftPanel';
import { BUTTON_TEXT } from '../../types/button';
import { Button } from '../ui/button';

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
        <div className="min-h-screen flex font-serif">

            <AuthLeftPanel />

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background">
                <div className="w-full max-w-md">
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
                        <div className="space-y-2">
                            <label
                                className="text-sm font-bold ml-1"
                            >
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all font-medium"
                                    required
                                    disabled={loading || !!success}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                size="lg"
                                disabled={loading || !!success}
                            >
                                {loading ? "Sending ..." : BUTTON_TEXT.RESET_LINK}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                size="lg"
                                onClick={() => navigate('/login')}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}