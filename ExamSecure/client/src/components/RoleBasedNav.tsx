import { Link, useLocation } from "wouter";

interface RoleBasedNavProps {
  role?: string;
  mobile?: boolean;
}

export default function RoleBasedNav({ role, mobile = false }: RoleBasedNavProps) {
  const [location] = useLocation();
  
  const getNavItems = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt' },
          { label: 'Users', path: '/users', icon: 'fas fa-users' },
          { label: 'System Settings', path: '/settings', icon: 'fas fa-cog' },
          { label: 'Reports', path: '/reports', icon: 'fas fa-chart-bar' },
        ];
      case 'instructor':
        return [
          { label: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt' },
          { label: 'Exams', path: '/exams', icon: 'fas fa-clipboard-list' },
          { label: 'Question Bank', path: '/questions', icon: 'fas fa-question-circle' },
          { label: 'Analytics', path: '/analytics', icon: 'fas fa-chart-line' },
        ];
      case 'proctor':
        return [
          { label: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt' },
          { label: 'Monitor', path: '/monitor', icon: 'fas fa-eye' },
          { label: 'Sessions', path: '/sessions', icon: 'fas fa-users-cog' },
          { label: 'Reports', path: '/reports', icon: 'fas fa-file-alt' },
        ];
      case 'student':
      default:
        return [
          { label: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt' },
          { label: 'Exams', path: '/exams', icon: 'fas fa-clipboard-list' },
          { label: 'Results', path: '/results', icon: 'fas fa-chart-line' },
          { label: 'Profile', path: '/profile', icon: 'fas fa-user' },
        ];
    }
  };

  const navItems = getNavItems(role || 'student');
  
  const baseClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-material";
  const activeClasses = "bg-primary-100 text-primary-700";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  if (mobile) {
    return (
      <div className="px-4 py-3">
        <div className="flex space-x-4 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${baseClasses} whitespace-nowrap ${
                location === item.path ? activeClasses : inactiveClasses
              }`}
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ml-10 flex items-baseline space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${baseClasses} ${
            location === item.path ? activeClasses : inactiveClasses
          }`}
        >
          <i className={`${item.icon} mr-2`}></i>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
