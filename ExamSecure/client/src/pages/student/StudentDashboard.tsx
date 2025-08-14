import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, TrendingUp, Clock, Play, Calendar, HelpCircle } from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['/api/exams'],
  });

  // Mock student stats
  const studentStats = {
    completedExams: 12,
    averageScore: 87.3,
    pendingExams: 2,
  };

  // Mock recent results
  const recentResults = [
    {
      id: '1',
      examTitle: 'Calculus I - Midterm Exam',
      completedDate: 'March 15, 2024',
      score: 92,
      grade: 'A-',
    },
    {
      id: '2',
      examTitle: 'Physics II - Chapter 5 Quiz',
      completedDate: 'March 12, 2024',
      score: 88,
      grade: 'B+',
    },
    {
      id: '3',
      examTitle: 'Chemistry - Lab Report Assessment',
      completedDate: 'March 10, 2024',
      score: 95,
      grade: 'A',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Take exams, view results, and track your academic progress</p>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-primary-100">
                <ClipboardCheck className="text-primary-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Exams</p>
                <p className="text-2xl font-bold text-gray-900">{studentStats.completedExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-secondary-100">
                <TrendingUp className="text-secondary-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{studentStats.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-accent-100">
                <Clock className="text-accent-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Exams</p>
                <p className="text-2xl font-bold text-gray-900">{studentStats.pendingExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Available Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {exams && exams.filter((exam: any) => exam.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {exams.filter((exam: any) => exam.status === 'active').map((exam: any) => (
                <Card key={exam.id} className="border hover:shadow-material transition-material">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="text-primary-600 h-4 w-4 mr-2" />
                            <span>Duration: </span>
                            <span className="font-medium ml-1">{exam.duration} minutes</span>
                          </div>
                          <div className="flex items-center">
                            <HelpCircle className="text-primary-600 h-4 w-4 mr-2" />
                            <span>AI Generated: </span>
                            <span className="font-medium ml-1">{exam.aiEnabled ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="text-primary-600 h-4 w-4 mr-2" />
                            <span>Created: </span>
                            <span className="font-medium ml-1">{new Date(exam.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{exam.description || 'Comprehensive exam covering course materials.'}</p>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <Link href={`/exam/${exam.id}`}>
                          <Button className="w-full lg:w-auto bg-primary-600 hover:bg-primary-700">
                            <Play className="h-4 w-4 mr-2" />
                            Start Exam
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No exams available at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{result.examTitle}</h3>
                  <p className="text-sm text-gray-600">Completed on {result.completedDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary-600">{result.score}%</div>
                  <p className="text-xs text-gray-600">Grade: {result.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
