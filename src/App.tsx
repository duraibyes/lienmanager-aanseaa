import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./components/screens/LoginScreen";
import SignupScreen from "./components/screens/SignupScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./components/screens/Dashboard";
import PublicRoute from "./routes/PublicRoute";
import ProjectCreateWizard from "./components/screens/ProjectCreateWizard";
import OnboardingScreen from "./components/screens/OnboardingScreen";
import { Template } from "./components/layout/member/Template";
import QuickRemediesScreen from "./components/screens/QuickRemediesScreen";
import RecentProjectsScreen from "./components/screens/RecentProjectsScreen";
import ProjectViewScreen from "./components/screens/ProjectViewScreen";
import ProjectTasks from "./components/screens/ProjectTasks";
import RecentContactsScreen from "./components/screens/RecentContactsScreen";
import DocumentScreen from "./components/screens/DocumentScreen";
import ContactScreen from "./components/screens/ContactScreen";
import DeadlineScreen from "./components/screens/DeadlineScreen";
import MainView from "./components/screens/MainView";
import AttorneyRoute from "./routes/AttorneyRoute";
import AttorneyLoginScreen from "./components/screens/attorney/AttorneyLoginScreen";
import AttorneySignupScreen from "./components/screens/attorney/AttorneySignupScreen";
import ProjectDashboard from "./components/screens/attorney/ProjectDashboard";
import ProjectLienView from "./components/screens/attorney/ProjectLienView";
import Profile from "./components/screens/attorney/Profile";
import UpdateProfile from "./components/screens/attorney/UpdateProfile";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./utils/ErrorFallback";
import MemberProfile from "./components/screens/MemberProfile";
import ForgotPasswordScreen from "./components/screens/forgotpassword";
import ResetPassword from "./components/screens/ResetPassword";

function App() {
  return (
    <BrowserRouter>
     <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error("App error:", error, info);
        }}
      >

      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <MainView />
          </PublicRoute> 
        } />
        <Route path="/login" element={
          <PublicRoute><LoginScreen /></PublicRoute>} />
        <Route path="/signup" element={
          <PublicRoute><SignupScreen /></PublicRoute>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordScreen />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />  
        
        <Route path="/project/create/:projectId?" element={
          <ProtectedRoute>
            <ProjectCreateWizard />
          </ProtectedRoute>
        }
        />
        <Route path="/projects" element={
          <ProtectedRoute><Template content={<RecentProjectsScreen />} /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Template content={<MemberProfile />} /></ProtectedRoute>
        } />
        <Route path="/project/:projectId" element={
          <ProtectedRoute>
            <Template content={<ProjectViewScreen />} />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute><Template content={<ProjectTasks />} /></ProtectedRoute>
        }
        />
        <Route path="/contacts" element={
          <ProtectedRoute><Template content={<RecentContactsScreen />} /></ProtectedRoute>
        }
        />
        <Route path="/documents" element={
          <ProtectedRoute><Template content={<DocumentScreen />} /></ProtectedRoute>
        }
        />
        <Route path="/customer-contacts" element={
          <ProtectedRoute><Template content={<ContactScreen />} /></ProtectedRoute>
        }
        />
        <Route path="/deadlines" element={
          <ProtectedRoute><Template content={<DeadlineScreen />} /></ProtectedRoute>
        } />
        <Route path="/quick-remedies" element={
          <ProtectedRoute><Template content={<QuickRemediesScreen />} /></ProtectedRoute>
        }
        />
        <Route path="/attorney/login" element={
          <AttorneyRoute>
            <AttorneyLoginScreen />
          </AttorneyRoute>
        } />
        <Route path="/attorney/signup" element={
          <AttorneyRoute>
            <AttorneySignupScreen />
          </AttorneyRoute>
        } />

        <Route path="/attorney/dashboard" element={
          <ProjectDashboard />
        } />
      
        <Route path="/attorney/projects/:projectId" element={
          <ProjectLienView />
        } />
        <Route path="attorney/profile" element={<Profile />} />
        <Route path="attorney/profile/update" element={<UpdateProfile />} />

        <Route path="/tour" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

