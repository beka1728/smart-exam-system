import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, BarChart, Play, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ExamCreationForm from "@/components/ExamCreationForm";
import { useState } from "react";

export default function InstructorDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exams, isLoading } = useQuery({
    queryKey: ['/api/exams'],
  });

  const startExamMutation = useMutation({
    mutationFn: async (examId: string) => {
      await apiRequest('POST', `/api/exams/${examId}/start`);
    },
    onSuccess: () => {
      toast({
        title: "Exam Started",
        description: "The exam is now active and available to students",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start exam",
        variant: "destructive",
      });
    },
  });

  const stopExamMutation = useMutation({
    mutationFn: async (examId: string) => {
      await apiRequest('POST', `/api/exams/${examId}/stop`);
    },
    onSuccess: () => {
      toast({
        title: "Exam Stopped",
        description: "The exam has been completed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to stop exam",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-secondary-100 text-secondary-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
        <p className="text-gray-600">Create and manage exams, questions, and monitor student performance</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="hover:shadow-material-lg transition-material cursor-pointer"
          onClick={() => setShowCreateForm(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="inline-flex p-4 rounded-lg bg-primary-100 mb-4">
              <Plus className="text-primary-600 h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Exam</h3>
            <p className="text-sm text-gray-600">Set up a new exam with AI-generated questions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-material-lg transition-material cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="inline-flex p-4 rounded-lg bg-secondary-100 mb-4">
              <BookOpen className="text-secondary-600 h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Question Bank</h3>
            <p className="text-sm text-gray-600">Manage your base questions and templates</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-material-lg transition-material cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="inline-flex p-4 rounded-lg bg-accent-100 mb-4">
              <BarChart className="text-accent-600 h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-sm text-gray-600">View detailed exam and student analytics</p>
          </CardContent>
        </Card>
      </div>

      {/* Exam Creation Form */}
      {showCreateForm && (
        <ExamCreationForm onClose={() => setShowCreateForm(false)} />
      )}

      {/* My Exams */}
      <Card>
        <CardHeader>
          <CardTitle>My Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {exams && exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam: any) => (
                <Card key={exam.id} className="border hover:shadow-material transition-material">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {exam.duration} minutes duration
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Enabled:</span>
                        <span>{exam.aiEnabled ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {exam.status === 'draft' ? (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => startExamMutation.mutate(exam.id)}
                          disabled={startExamMutation.isPending}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      ) : exam.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="flex-1"
                          onClick={() => stopExamMutation.mutate(exam.id)}
                          disabled={stopExamMutation.isPending}
                        >
                          Stop
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No exams created yet</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Exam
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
