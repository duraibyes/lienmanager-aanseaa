import { useState } from 'react';
import {
  Mail,
  Lock,
  AlertCircle,
  EyeOff,
  Eye,
  ArrowRight,
  Scale,
  Home,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { validateEmail } from '../../utils/validation';
import { Button } from '../ui/button';

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const validationErrors: LoginErrors = {
      email: validateEmail(email) || undefined,
      password: password.length === 0 ? 'Password is required' : undefined,
    };

    Object.keys(validationErrors).forEach(
      (key) =>
        validationErrors[key as keyof LoginErrors] === undefined &&
        delete validationErrors[key as keyof LoginErrors]
    );

    setErrors(validationErrors);
    console.log('  validationErrors ', validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const extractErrorMessage = (err: any): string => {
    if (err?.data?.errors) {
      const firstKey = Object.keys(err.data.errors)[0];
      return err.data.errors[firstKey][0];
    }
    if (err?.data?.message) return err.data.message;
    return 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      if (!res?.active_projects?.length) {
        navigate('/tour');
      }
    } catch (err: any) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="max-w-md text-center space-y-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-primary glow-primary">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="font-serif font-bold text-3xl text-white">LienPilot</span>
            </Link>

            <h1 className="text-3xl font-serif font-bold text-white text-balance">
              Manage Your Construction Liens with Confidence
            </h1>

            <p className="text-white/70 text-lg leading-relaxed">
              Track deadlines, organize documents, and ensure compliance with state-specific lien laws
              all in one powerful platform.
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <span>Never miss critical deadlines</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm font-semibold">2</span>
                </div>
                <span>Keep all documents organized</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <span>Stay compliant with ease</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

              <h2 className="text-3xl font-serif font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground">
                Sign in to access your legal practice dashboard
              </p>
            </div>
          </div>


          {(errorMessage || Object.keys(errors).length > 0) && (
            <div className="error-box">
              <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
              <p className="error-text">
                {errorMessage || Object.values(errors)[0]}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 ">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1"
              >Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold">Password</label>
                <Link to="/forgot-password" className="text-primary text-sm font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate('/signup')}
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