import { useState } from 'react';
import {
  Mail,
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { validateEmail, validatePassword } from '../../utils/validation';
import { useAppDispatch } from '../../store/hooks';
import { useSignupMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { AuthLeftPanel } from '../layout/auth/AuthLeftPanel';
import LinkButton from '../Button/LinkButton';
import { Button } from '../ui/button';
import ErrorBox from '../Parts/ErrorBox';

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const [signup] = useSignupMutation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        email,
        password,
        password_confirmation: confirmPassword,
      }).unwrap();

      dispatch(setCredentials(res));
      navigate('attorney/dashboard');
    } catch (err: any) {
      if (err?.data?.errors) {
        const firstKey = Object.keys(err.data.errors)[0];
        setError(err.data.errors[firstKey][0]);
      } else if (err?.data?.message) {
        setError(err.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-serif">

      {/* Left Section: Branding & Social Proof */}
      <AuthLeftPanel />

      {/* Right Section: Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50/30">
        <div className="w-full max-w-[420px]">

          <div className="space-y-2 mb-4">
            <h2 className="text-3xl font-serif font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground">
              Get started with LienPilot to manage your construction projects
            </p>
          </div>

          {error && (
            <ErrorBox error={error} />
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Email Address */}
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
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className="text-sm font-bold ml-1"
              >
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                className="text-sm font-bold ml-1"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating ..." : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <LinkButton to='/login' label='Sign in' />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}