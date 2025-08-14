import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <i className="fas fa-graduation-cap text-primary-600 text-6xl mr-4"></i>
            <h1 className="text-5xl font-bold text-gray-900">EduExam Pro</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered digital examination system with advanced proctoring and integrity features
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <i className="fas fa-robot text-primary-600 text-3xl mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Questions</h3>
              <p className="text-gray-600 text-sm">
                Generate unique question variants for each student using advanced AI
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <i className="fas fa-eye text-secondary-600 text-3xl mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Real-time Proctoring</h3>
              <p className="text-gray-600 text-sm">
                Monitor exam sessions with AI-powered anomaly detection
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <i className="fas fa-shield-alt text-accent-600 text-3xl mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Secure Environment</h3>
              <p className="text-gray-600 text-sm">
                Advanced integrity features to prevent cheating and maintain fairness
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <i className="fas fa-chart-line text-purple-600 text-3xl mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive insights into student performance and exam metrics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Access */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Role-Based Access Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <i className="fas fa-crown text-purple-600 text-2xl mb-3"></i>
                <h3 className="font-semibold text-purple-900 mb-2">Admin</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Manage system users</li>
                  <li>• Monitor platform health</li>
                  <li>• System configuration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-6">
                <i className="fas fa-chalkboard-teacher text-primary-600 text-2xl mb-3"></i>
                <h3 className="font-semibold text-primary-900 mb-2">Instructor</h3>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li>• Create and manage exams</li>
                  <li>• Configure difficulty mix</li>
                  <li>• View student analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-accent-50 border-accent-200">
              <CardContent className="p-6">
                <i className="fas fa-eye text-accent-600 text-2xl mb-3"></i>
                <h3 className="font-semibold text-accent-900 mb-2">Proctor</h3>
                <ul className="text-sm text-accent-700 space-y-1">
                  <li>• Monitor exam sessions</li>
                  <li>• Pause/resume students</li>
                  <li>• Review flagged activities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-secondary-50 border-secondary-200">
              <CardContent className="p-6">
                <i className="fas fa-user-graduate text-secondary-600 text-2xl mb-3"></i>
                <h3 className="font-semibold text-secondary-900 mb-2">Student</h3>
                <ul className="text-sm text-secondary-700 space-y-1">
                  <li>• Take secure exams</li>
                  <li>• View results & feedback</li>
                  <li>• Track progress</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <div>
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg mr-4"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Sign In to Get Started
            </Button>
            <Link href="/guide">
              <Button 
                variant="outline"
                size="lg" 
                className="px-8 py-3 text-lg"
              >
                <i className="fas fa-book mr-2"></i>
                How to Use
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            New to the system? Check out our comprehensive user guide first
          </p>
        </div>
      </div>
    </div>
  );
}
