import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pause, Play, Eye, Square } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface StudentSession {
  id: string;
  studentName: string;
  studentId: string;
  progress: number;
  progressText: string;
  timeRemaining: string;
  status: 'active' | 'paused' | 'completed';
  profileUrl?: string;
}

interface StudentMonitorProps {
  sessions: StudentSession[];
}

export default function StudentMonitor({ sessions }: StudentMonitorProps) {
  const { toast } = useToast();

  const pauseSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await apiRequest('POST', `/api/proctor/sessions/${sessionId}/pause`);
    },
    onSuccess: () => {
      toast({
        title: "Session Paused",
        description: "The student's session has been paused",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to pause session",
        variant: "destructive",
      });
    },
  });

  const resumeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await apiRequest('POST', `/api/proctor/sessions/${sessionId}/resume`);
    },
    onSuccess: () => {
      toast({
        title: "Session Resumed",
        description: "The student's session has been resumed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resume session",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-secondary-100 text-secondary-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>;
      case 'paused': return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'completed': return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handlePauseResume = (session: StudentSession) => {
    if (session.status === 'active') {
      pauseSessionMutation.mutate(session.id);
    } else if (session.status === 'paused') {
      resumeSessionMutation.mutate(session.id);
    }
  };

  return (
    <Card className="shadow-material">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Student Sessions</span>
          <Badge variant="outline">
            {sessions.filter(s => s.status === 'active').length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-lg bg-gray-100 mb-4">
              <i className="fas fa-users text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Sessions</h3>
            <p className="text-gray-600">There are currently no students taking exams.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Time Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id} className="hover:bg-gray-50 transition-material">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.profileUrl} />
                            <AvatarFallback className="text-xs">
                              {getInitials(session.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1">
                            {getStatusIcon(session.status)}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{session.studentName}</p>
                          <p className="text-sm text-gray-600">{session.studentId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full max-w-[120px]">
                        <Progress value={session.progress} className="h-2 mb-1" />
                        <p className="text-xs text-gray-600">{session.progressText}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        session.timeRemaining.startsWith('0') || session.timeRemaining.split(':')[0] === '0'
                          ? 'text-red-600' 
                          : 'text-gray-900'
                      }`}>
                        {session.timeRemaining}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePauseResume(session)}
                          disabled={
                            pauseSessionMutation.isPending || 
                            resumeSessionMutation.isPending ||
                            session.status === 'completed'
                          }
                          title={session.status === 'active' ? 'Pause Session' : 'Resume Session'}
                        >
                          {session.status === 'active' ? (
                            <Pause className="h-4 w-4 text-yellow-600" />
                          ) : session.status === 'paused' ? (
                            <Play className="h-4 w-4 text-green-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Session Details"
                        >
                          <Eye className="h-4 w-4 text-primary-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Terminate Session"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
