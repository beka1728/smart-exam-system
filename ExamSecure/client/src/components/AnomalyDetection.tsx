import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, Pause, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Anomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
  studentId: string;
  sessionId: string;
}

export default function AnomalyDetection() {
  const { toast } = useToast();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: '1',
      type: 'rapid_answer_pattern',
      severity: 'high',
      description: 'Student answered 5 questions in 30 seconds',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      studentId: 'student-123',
      sessionId: 'session-456',
    },
    {
      id: '2',
      type: 'tab_switching',
      severity: 'medium',
      description: 'Student switched browser tabs 3 times during question 12',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      studentId: 'student-789',
      sessionId: 'session-101',
    },
    {
      id: '3',
      type: 'identical_answers',
      severity: 'high',
      description: 'Detected identical phrasing with another student (85% similarity)',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      studentId: 'student-456',
      sessionId: 'session-789',
    },
  ]);

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

  const dismissAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
    toast({
      title: "Alert Dismissed",
      description: "The anomaly alert has been dismissed",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  return (
    <Card className="shadow-material">
      <CardHeader>
        <CardTitle className="flex items-center">
          <i className="fas fa-robot text-primary-600 mr-2"></i>
          AI Integrity Monitor
          {anomalies.length > 0 && (
            <Badge className="ml-2 bg-red-100 text-red-700">
              {anomalies.length} alerts
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-lg bg-green-100 mb-4">
              <i className="fas fa-shield-check text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear</h3>
            <p className="text-gray-600">No suspicious activities detected at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div 
                key={anomaly.id} 
                className={`flex items-start space-x-3 p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium capitalize">
                          {anomaly.type.replace(/_/g, ' ')}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {anomaly.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{anomaly.description}</p>
                      <p className="text-xs opacity-75">
                        Student ID: {anomaly.studentId} • {formatTimestamp(anomaly.timestamp)}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => pauseSessionMutation.mutate(anomaly.sessionId)}
                        disabled={pauseSessionMutation.isPending}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => dismissAnomaly(anomaly.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
