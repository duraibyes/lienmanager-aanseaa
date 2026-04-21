import {Eye, EyeOff, Lock, Mail, Scale, ArrowRight, Home } from "lucide-react"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../features/auth/authApi";
import { setCredentials } from "../../../features/auth/authSlice";
import { LoginErrors } from "../LoginScreen";
import { validateEmail } from "../../../utils/validation";
import { Button } from '../../ui/button';
import { AuthLeftAttorneyPanel } from '../../layout/auth/AuthLeftAttorneyPanel';
import ErrorBox from '../../Parts/ErrorBox';

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
    <div className="min-h-screen flex font-serif">
      {/* Left Side - Branding */}
      <AuthLeftAttorneyPanel />

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
          </div>
          <div>
            <div className="space-y-2 mb-4">

              <h2 className="text-3xl font-serif font-bold text-foreground">Welcome back, Counselor</h2>
              <p className="text-muted-foreground">
                Sign in to handle your client liens and legal workflows
              </p>
            </div>
          </div>

          {(error || Object.keys(errors).length > 0) && (
            <ErrorBox error={error || Object.values(errors)[0]} />
          )}
          <form onSubmit={handleLogin} className="space-y-6 mt-2">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1"
              >Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold">Password</label>
                <Link to="/attorney/forgot-password" className="text-primary text-sm font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 focus:text-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>


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

              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate('/attorney/signup')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}

export default AttorneyLoginScreen