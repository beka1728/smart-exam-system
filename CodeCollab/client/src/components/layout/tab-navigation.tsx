import { Link, useLocation } from "wouter";
import { BarChart3, Brain, Users, ChartBar } from "lucide-react";

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
  { id: 'generator', label: 'Question Generator', icon: Brain, path: '/generator' },
  { id: 'students', label: 'Students', icon: Users, path: '/students' },
  { id: 'analytics', label: 'Analytics', icon: ChartBar, path: '/analytics' },
];

export default function TabNavigation() {
  const [location] = useLocation();

  return (
    <nav className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location === tab.path;
            
            return (
              <Link key={tab.id} href={tab.path}>
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>
    </nav>
  );
}
