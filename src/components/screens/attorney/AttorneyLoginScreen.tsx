import { AlertCircle, Eye, EyeOff, Lock, Mail, Scale } from "lucide-react"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../features/auth/authApi";
import { setCredentials } from "../../../features/auth/authSlice";
import { LoginErrors } from "../LoginScreen";
import { validateEmail } from "../../../utils/validation";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Scale className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Lien Manager</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Sign In</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 font-medium">New user?</p>
          <p className="text-blue-600">
            Click{' '}
            <button
              onClick={() => navigate('/attorney/signup')}
              className="text-blue-700 font-semibold underline hover:text-blue-800"
            >
              Sign up
            </button>{' '}
            below to create your account.
          </p>
        </div>

        {errors && Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{Object.values(errors)[0]}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/attorney/signup')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Don't have an account? Sign up
          </button>
          <p className="text-slate-600">
            Switch to
            <Link
              to="/"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors ml-2"
            >
              Main View
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AttorneyLoginScreen