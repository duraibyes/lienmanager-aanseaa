import { useState } from 'react';
import {
  Mail,
  Lock,
  AlertCircle,
  EyeOff,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { validateEmail } from '../../utils/validation';
import { COPY_RIGHT } from '../../utils/config';
import { AuthLeftPanel } from '../layout/auth/AuthLeftPanel';
import { PrimaryButton } from '../Button/PrimaryButton';
import { BUTTON_TEXT } from '../../types/button';
import LinkButton from '../Button/LinkButton';

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
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">

      {/* Left Section*/}
      <AuthLeftPanel
        title="Optimize your workflow with precision."
        subtitle="Join thousands of teams managing their projects with our intuitive interface and powerful analytics."
        footer={<span>{COPY_RIGHT}</span>}
      />

      {/* Right Section: Form Content */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50/30">
        <div className="w-full max-w-[400px]">

          <div className="mb-10">
            <h1 className="text-4xl text-text font-bold"
            >
              Welcome back
            </h1>
            <p className="mt-2 text-textMuted">
              Login to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {(errorMessage || Object.keys(errors).length > 0) && (
            <div className="error-box">
              <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
              <p className="error-text">
                {errorMessage || Object.values(errors)[0]}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <PrimaryButton
              type='submit'
              label={BUTTON_TEXT.SIGN_IN}
              loading={loading}
              icon={<ArrowRight size={18} />}
            />
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{" "}
              <LinkButton to="/signup" label='Create an account' />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}