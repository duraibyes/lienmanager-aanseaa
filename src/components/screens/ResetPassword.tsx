import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { validatePassword } from "../../utils/validation";

interface ResetPasswordErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);

  // 🎨 OPTRIXX THEME CONSTANTS
  const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
  const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

  // ✅ Validation Logic (Preserved)
  const validateForm = (): boolean => {
    const newErrors: ResetPasswordErrors = {};

    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError("");

    try {
      // 👉 Replace this with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSuccess(true);

      // ✅ Redirect after delay
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err: any) {
      setGeneralError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">
      
      {/* Left Section: Branding & Security Focus */}
      <div 
        style={{ background: primaryGradient }}
        className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            {/* Logo Box with Secondary Gradient */}
            <div 
              style={{ background: secondaryGradient }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl border border-white/20"
            >
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span 
              className="text-2xl font-bold tracking-tight"
              style={{ 
                backgroundImage: secondaryGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent', 
                backgroundClip: 'text',
                display: 'inline-block' 
              }}
            >
              Optrixx
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold mb-6 leading-tight text-white drop-shadow-sm">
              Secure your account with a new password.
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-100 shrink-0" />
                <p className="text-blue-50/90 text-lg font-medium leading-relaxed">
                  Use at least 8 characters with a mix of letters and numbers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex gap-6 text-sm text-blue-100/70 font-medium">
          <span>© {new Date().getFullYear()} Optrixx Inc.</span>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50/30">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10 text-left">
            <h1 
              className="text-3xl font-extrabold tracking-tight"
              style={{ 
                backgroundImage: secondaryGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block' 
              }}
            >
              Set New Password
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Almost there! Please choose a strong password.</p>
          </div>

          {/* Feedback Messages */}
          {(generalError || Object.keys(errors).length > 0) && !success && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 leading-relaxed font-medium">
                {generalError || Object.values(errors)[0]}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="text-emerald-500 w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                Password reset successful! Redirecting you to login...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label 
                className="text-sm font-bold ml-1"
                style={{ 
                  backgroundImage: secondaryGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block' 
                }}
              >
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  disabled={success}
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
                style={{ 
                  backgroundImage: secondaryGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block' 
                }}
              >
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              style={{ background: !(loading || success) ? primaryGradient : '#cbd5e1' }}
              className="w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-70 shadow-xl shadow-blue-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Remembered your password?{" "}
              <Link 
                to="/login" 
                style={{ color: '#0075be' }}
                className="font-extrabold hover:underline underline-offset-4 decoration-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}