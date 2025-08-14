import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Users, AlertTriangle, PauseCircle, Clock, Pause, Eye, Square } from "lucide-react";
import AnomalyDetection from "@/components/AnomalyDetection";
import StudentMonitor from "@/components/StudentMonitor";

export default function ProctorDashboard() {
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/proctor/sessions'],
  });

  // Mock real-time data - in production this would come from WebSocket
  const mockStats = {
    activeStudents: 47,
    flaggedActivities: 3,
    pausedSessions: 2,
    avgTimeRemaining: 32,
  };

  const mockActiveSessions = [
    {
      id: '1',
      studentName: 'Alex Thompson',
      studentId: 'ST-2024-001',
      progress: 65,
      progressText: '13/20 questions',
      timeRemaining: '28:45',
      status: 'active',
      profileUrl: null,
    },
    {
      id: '2',
      studentName: 'Sarah Chen',
      studentId: 'ST-2024-002',
      progress: 80,
      progressText: '16/20 questions',
      timeRemaining: '15:30',
      status: 'active',
      profileUrl: null,
    },
    {
      id: '3',
      studentName: 'Michael Rodriguez',
      studentId: 'ST-2024-003',
      progress: 45,
      progressText: '9/20 questions',
      timeRemaining: '42:15',
      status: 'paused',
      profileUrl: null,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-secondary-100 text-secondary-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Proctor Dashboard</h1>
        <p className="text-gray-600">Monitor active exam sessions and maintain academic integrity</p>
      </div>

      {/* Real-time Monitoring Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.activeStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <AlertTriangle className="text-yellow-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Flagged Activities</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.flaggedActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <PauseCircle className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paused Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.pausedSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Clock className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Time Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(mockStats.avgTimeRemaining)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Anomaly Detection */}
      <AnomalyDetection />

      {/* Student Session Monitoring */}
      <StudentMonitor sessions={mockActiveSessions} />
    </div>
  );
}
