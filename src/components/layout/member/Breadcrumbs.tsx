import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map paths to readable names
  const pathLabels: { [key: string]: string } = {
    dashboard: 'Dashboard',
    project: 'Projects',
    'project-create': 'Create Project',
    'customer-contacts': 'Contacts',
    documents: 'Documents',
    tasks: 'Tasks',
    deadlines: 'Deadlines',
    'quick-remedies': 'Quick Remedies',
    contacts: 'Contacts',
    profile: 'Profile',
    tour: 'Tour',
  };

  const getLabel = (path: string) => {
    return pathLabels[path] || path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  const breadcrumbs = [
    { label: 'Home', path: '/dashboard' },
    ...pathnames.map((name, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        label: getLabel(name),
        path,
      };
    }),
  ];

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 px-4 py-3 bg-white/50 backdrop-blur-sm border-b border-gray-100/50">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
          )}
          <button
            onClick={() => navigate(crumb.path)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              index === breadcrumbs.length - 1
                ? 'bg-gradient-to-r from-[#0075be] to-[#00aeea] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            {index === 0 && <Home className="w-4 h-4" />}
            {crumb.label}
          </button>
        </div>
      ))}
    </nav>
  );
}