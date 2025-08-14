import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Users, Shield, BarChart3, PenTool, Eye, PlayCircle, CheckCircle } from "lucide-react";

export default function UserGuide() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">How to Use EduExam Pro</h1>
        <p className="text-gray-600">Your complete guide to the AI-powered digital exam system</p>
      </div>

      {/* Getting Started */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Getting Started
          </CardTitle>
          <CardDescription>First steps to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">1</Badge>
              <div>
                <h4 className="font-medium">Login to the System</h4>
                <p className="text-sm text-gray-600">Click the "Login" button to access the platform using your Replit account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-1">2</Badge>
              <div>
                <h4 className="font-medium">Choose Your Role</h4>
                <p className="text-sm text-gray-600">The system will detect your role (Student, Instructor, Proctor, or Admin) and show the appropriate dashboard</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-based Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Student Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-500" />
              For Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Take exams with AI-generated unique questions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>View real-time timer and progress</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Submit answers and get instant results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Review performance and feedback</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Instructor Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-purple-500" />
              For Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Create and manage exams</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Set up AI-powered question generation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Configure difficulty levels and time limits</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Review student results and analytics</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Proctor Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              For Proctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Monitor live exam sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Receive AI-powered anomaly alerts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Pause/resume student sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Add notes and flagged activities</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Admin Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-500" />
              For Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Manage user roles and permissions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>View system-wide analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Configure AI settings and policies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Monitor system performance</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key AI-Powered Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-blue-600">Smart Question Generation</h4>
              <p className="text-sm text-gray-600 mb-4">Each student gets unique question variants that test the same concepts but with different wording and examples.</p>
              
              <h4 className="font-medium mb-2 text-purple-600">Automated Scoring</h4>
              <p className="text-sm text-gray-600 mb-4">AI evaluates short-answer and essay questions with detailed feedback and consistent grading.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-orange-600">Real-time Monitoring</h4>
              <p className="text-sm text-gray-600 mb-4">Live tracking of student activities with instant alerts for suspicious behavior patterns.</p>
              
              <h4 className="font-medium mb-2 text-green-600">Integrity Detection</h4>
              <p className="text-sm text-gray-600">Advanced AI analyzes timing patterns, answer similarities, and device changes to ensure exam security.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Follow these steps to get started immediately</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Step 1: Login</h4>
              <p className="text-sm text-gray-600">Click "Login" on the homepage to authenticate with your Replit account</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Step 2: Access Dashboard</h4>
              <p className="text-sm text-gray-600">Once logged in, you'll see your role-specific dashboard with available actions</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Step 3: Explore Features</h4>
              <p className="text-sm text-gray-600">Navigate using the sidebar menu to access exams, monitoring, or administration features</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium">Step 4: Start Creating</h4>
              <p className="text-sm text-gray-600">Instructors can create exams, students can take them, and proctors can monitor sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}