import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { validateEmail } from "@/utils/validation"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Gavel, Link, Scale } from "lucide-react"

const AttorneyForgotPasswordScreen = () => {
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
                navigate('/attorney/login');
            }, 2500);

        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="attorney-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#attorney-grid)" />
                    </svg>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
                    <div className="max-w-md text-center space-y-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-primary glow-primary">
                                <Scale className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-serif font-bold text-3xl text-secondary-foreground">LienPilot</span>
                        </Link>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                            <Gavel className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Attorney Portal</span>
                        </div>

                        <h1 className="text-3xl font-serif font-bold text-secondary-foreground text-balance">
                            Streamline Your Construction Lien Practice
                        </h1>

                        <p className="text-slate-300 text-lg leading-relaxed">
                            Manage cases, track deadlines, and serve your clients better with powerful
                            legal practice tools designed for construction attorneys.
                        </p>

                        <div className="flex flex-col gap-4 pt-4 text-slate-300">
                            <div className="flex items-center gap-3 text-secondary-foreground/80">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">1</span>
                                </div>
                                <span>Case management & tracking</span>
                            </div>
                            <div className="flex items-center gap-3 text-secondary-foreground/80">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">2</span>
                                </div>
                                <span>Document automation</span>
                            </div>
                            <div className="flex items-center gap-3 text-secondary-foreground/80">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">3</span>
                                </div>
                                <span>Client portal access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary glow-primary">
                                <Scale className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-serif font-bold text-2xl text-foreground">LienPilot</span>
                        </Link>
                        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-primary/10">
                            <Gavel className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium text-primary">Attorney Portal</span>
                        </div>
                    </div>

                    {/* {children} */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Gavel className="h-6 w-6 text-primary" />
                                <span className="text-sm font-medium text-primary">Attorney Portal</span>
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-foreground">Forgot password?</h2>
                            <p className="text-muted-foreground">
                                No worries, we&apos;ll send you reset instructions.
                            </p>
                        </div>
                        {error && (
                            <div className="mb-6 p-4 bg-primary/5 border border-primary rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="text-primary w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-sm text-primary font-medium leading-relaxed">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle className="text-emerald-500 w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-sm text-emerald-700 font-medium leading-relaxed">{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="attorney@lawfirm.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setError("")
                                        }}
                                        className={error ? "border-destructive" : ""}
                                    />
                                    {/* {error && <FieldError>{error}</FieldError>} */}
                                </Field>
                            </FieldGroup>

                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Reset Password"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                <Button variant="outline" className="w-full" size="lg" onClick={() => navigate('/attorney/login')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Sign In
                                </Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AttorneyForgotPasswordScreen