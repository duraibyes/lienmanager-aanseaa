import { AlertCircle, ArrowRight, Eye, EyeOff, Gavel, Home, Scale } from "lucide-react"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../features/auth/authApi";
import { setCredentials } from "../../../features/auth/authSlice";
import { LoginErrors } from "../LoginScreen";
import { validateEmail } from "../../../utils/validation";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const AttorneyLoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");
    setLoading(true);

    try {
      const res = await login({
        email,
        password,
      }).unwrap();

      console.log(res);
      if (res?.user?.role === 7) {
        console.log("Login successful");
        dispatch(setCredentials(res));
      } else {
        setError("Please log in using the Lien Provider account credentials");
      }

    } catch (err: any) {
      // Laravel validation error
      if (err?.data?.errors) {
        const firstKey = Object.keys(err.data.errors)[0];
        setError(err.data.errors[firstKey][0]);
      } else if (err?.data?.message) {
        setError(err.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
            <Link to="/" className="inline-flex items-center gap-3">
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

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-primary">Attorney Portal</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground">
                Sign in to access your legal practice dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary/60 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary/60">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="attorney@lawfirm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <FieldError className="text-red-600">{errors.email}</FieldError>}
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      to="/attorney/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && <FieldError className="text-red-600">{errors.password}</FieldError>}
                </Field>
              </FieldGroup>

              {errors.general && (
                <div className="p-3 rounded-lg bg-red-500 text-destructive text-sm">
                  {errors.general}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Main View
                </Button>
              </div>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don’t have an account?{" "} </span>
              <Link to="/attorney/signup" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttorneyLoginScreen