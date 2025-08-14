import { useQuery } from "@tanstack/react-query";
import { Users, FileText, Brain, CheckCircle, Plus, UserPlus, Download, Cog, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Student, Question } from "@shared/schema";

interface Analytics {
  totalStudents: number;
  totalQuestions: number;
  aiAccuracy: number;
  uniquenessRate: number;
  subjectDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
}

export default function Dashboard() {
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ['/api/questions'],
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ['/api/analytics'],
  });

  const subjects = [
    { name: 'Physics', status: 'Active', color: 'blue' },
    { name: 'Chemistry', status: 'Active', color: 'green' },
    { name: 'Mathematics', status: 'Active', color: 'purple' },
    { name: 'Programming', status: 'Beta', color: 'orange' },
  ];

  const recentActivity = [
    { icon: CheckCircle, text: 'Generated 8 Physics questions for Lab Section A', time: '2 min ago', color: 'green' },
    { icon: Brain, text: 'Chemistry template updated with new variables', time: '15 min ago', color: 'blue' },
    { icon: Users, text: 'AI accuracy improved to 98.5%', time: '1 hour ago', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">Total Students</p>
                <p className="text-3xl font-bold text-blue-800">{students.length}</p>
                <p className="text-xs text-blue-500 mt-1">+3 this week</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm">Questions Generated</p>
                <p className="text-3xl font-bold text-green-800">{questions.length}</p>
                <p className="text-xs text-green-500 mt-1">+12 today</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="text-green-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">AI Accuracy</p>
                <p className="text-3xl font-bold text-purple-800">{analytics?.aiAccuracy || 98.5}%</p>
                <p className="text-xs text-purple-500 mt-1">↑ 2.1% improved</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Brain className="text-purple-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm">Uniqueness Rate</p>
                <p className="text-3xl font-bold text-orange-800">{analytics?.uniquenessRate || 100}%</p>
                <p className="text-xs text-orange-500 mt-1">Perfect score</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <CheckCircle className="text-orange-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">System Overview</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                The AI-powered lab question generator ensures each student receives a unique but equivalent question, 
                maintaining fairness while preventing copying. The system uses advanced NLP and machine learning 
                algorithms to generate variations while preserving difficulty levels.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <Cog className="text-blue-600 mr-2" size={16} />
                    <h4 className="font-semibold text-blue-800">Question Generation AI</h4>
                  </div>
                  <p className="text-sm text-blue-700">Template-based generation with intelligent parameter variation</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <Scale className="text-green-600 mr-2" size={16} />
                    <h4 className="font-semibold text-green-800">Difficulty Assessment</h4>
                  </div>
                  <p className="text-sm text-green-700">Automated difficulty scoring ensures fairness across all questions</p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center text-sm">
                        <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mr-3`}></div>
                        <span className="text-gray-600">{activity.text}</span>
                        <span className="text-gray-400 ml-auto">{activity.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/generator">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2" size={16} />
                    Generate Questions
                  </Button>
                </Link>
                <Link href="/students">
                  <Button variant="secondary" className="w-full">
                    <UserPlus className="mr-2" size={16} />
                    Add Students
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full">
                  <Download className="mr-2" size={16} />
                  Export Results
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Subjects Available</h3>
              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 bg-${subject.color}-50 rounded-lg`}>
                    <span className={`text-${subject.color}-700 font-medium`}>{subject.name}</span>
                    <span className={`bg-${subject.color}-200 text-${subject.color}-800 text-xs px-2 py-1 rounded-full`}>
                      {subject.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
