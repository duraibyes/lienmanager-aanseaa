import { ArrowRight, Shield, Clock, FileCheck, TrendingUp, CheckCircle, Zap, Home } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function WelcomeScreen({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex flex-col">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <button
            onClick={onBackToDashboard}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            Construction Lien &<br />Bond Claim Calculator
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Know your rights. Protect your payment. Calculate deadlines instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-slate-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Instant Calculations
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Get state-specific lien deadlines and bond claim dates calculated in real-time as you enter your project details.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-slate-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Clear Action Steps
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Know exactly what notices to send, when to send them, and what documents you need to protect your payment rights.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-slate-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Never Miss a Deadline
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Track critical dates, set up reminders, and stay on top of preliminary notices and lien filing requirements.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Start Your Project Setup
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Create a comprehensive project record to track deadlines, manage documents, and understand your lien rights. No account needed.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">100% Free - No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">State-specific deadline calculations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">Document management & organization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">Educational guidance at every step</span>
                </div>
              </div>
              <Link
              to="/project/create"
                className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
              >
                Start New Project
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 border border-blue-200">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-700">Preliminary Notice</span>
                    </div>
                    <p className="text-xs text-slate-600 ml-5">Due in 18 days</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-700">Notice of Intent</span>
                    </div>
                    <p className="text-xs text-slate-600 ml-5">Due in 58 days</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-700">Lien Filing Deadline</span>
                    </div>
                    <p className="text-xs text-slate-600 ml-5">Due in 88 days</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-blue-900 font-medium">Real-time deadline tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-600">
            Used by contractors, subcontractors, and suppliers nationwide to protect their payment rights
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
