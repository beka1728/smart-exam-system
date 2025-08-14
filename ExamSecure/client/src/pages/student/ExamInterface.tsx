import { useState, useEffect, useCallback } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from "lucide-react";
import { useWebSocket } from "@/lib/websocket";

interface Question {
  id: string;
  content: string;
  type: string;
  options?: string;
  correctAnswer: string;
  points: number;
}

interface Answer {
  questionId: string;
  answer: string;
  timeSpent: number;
}

export default function ExamInterface() {
  const { id: examId } = useParams();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WebSocket connection for real-time monitoring
  const { sendMessage } = useWebSocket();

  const { data: examData, isLoading } = useQuery({
    queryKey: ['/api/exams', examId, 'paper'],
    queryFn: async () => {
      const response = await apiRequest('POST', `/api/exams/${examId}/paper`, {
        deviceInfo: {
          userAgent: navigator.userAgent,
          screen: { width: screen.width, height: screen.height },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      });
      return response.json();
    },
  });

  const submitExamMutation = useMutation({
    mutationFn: async (examAnswers: Answer[]) => {
      await apiRequest('POST', `/api/sessions/${examData.session.id}/submit`, {
        answers: examAnswers,
      });
    },
    onSuccess: () => {
      toast({
        title: "Exam Submitted",
        description: "Your exam has been submitted successfully",
      });
      // Redirect to results or dashboard
      window.location.href = '/';
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Initialize timer
  useEffect(() => {
    if (examData?.session?.timeRemaining) {
      setTimeRemaining(examData.session.timeRemaining);
    }
  }, [examData]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Send time update to server
        if (examData?.session?.id && newTime % 30 === 0) {
          sendMessage({
            type: 'time_update',
            sessionId: examData.session.id,
            timeRemaining: newTime,
          });
        }

        // Auto-submit when time is up
        if (newTime <= 0) {
          handleSubmit();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, examData?.session?.id, sendMessage]);

  // Track student activity
  const trackActivity = useCallback((activityType: string, data: any = {}) => {
    if (examData?.session?.id) {
      sendMessage({
        type: 'student_activity',
        sessionId: examData.session.id,
        activity: { type: activityType, data },
      });
    }
  }, [examData?.session?.id, sendMessage]);

  // Integrity protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      trackActivity('context_menu_attempt');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common shortcuts
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a')) {
        e.preventDefault();
        trackActivity('keyboard_shortcut_attempt', { key: e.key });
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        trackActivity('dev_tools_attempt');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackActivity('window_blur');
      } else {
        trackActivity('window_focus');
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      trackActivity('page_unload_attempt');
      e.returnValue = '';
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackActivity]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const saveAnswer = (questionId: string, answer: string) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      const newAnswer = { questionId, answer, timeSpent };
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], answer };
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });

    trackActivity('answer_changed', { questionId, answerLength: answer.length });
  };

  const navigateToQuestion = (index: number) => {
    if (index < 0 || index >= (examData?.questions?.length || 0)) return;
    
    setCurrentQuestionIndex(index);
    setQuestionStartTime(Date.now());
    trackActivity('question_navigation', { 
      from: currentQuestionIndex, 
      to: index 
    });
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
    trackActivity('question_flagged', { questionId });
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    trackActivity('exam_submit_attempt');
    submitExamMutation.mutate(answers);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examData?.questions || examData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available for this exam.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.answer || '';

  return (
    <div className="min-h-screen bg-gray-50 exam-content">
      {/* Header with timer and progress */}
      <div className="bg-white shadow-material border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              {examData.exam.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="text-primary-600 h-4 w-4 mr-2" />
                <span className={`font-medium ${timeRemaining < 300 ? 'text-red-600' : 'text-accent-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {examData.questions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-600 mt-2">Progress: {Math.round(progress)}% complete</p>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <Button
                    variant={flaggedQuestions.has(currentQuestion.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFlag(currentQuestion.id)}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {flaggedQuestions.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
                  </Button>
                </div>
                <p className="text-gray-700 mb-6 whitespace-pre-wrap">{currentQuestion.content}</p>

                {/* Answer Input */}
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
                  <RadioGroup 
                    value={currentAnswer} 
                    onValueChange={(value) => saveAnswer(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      {JSON.parse(currentQuestion.options).map((option: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-material">
                          <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <Textarea
                    placeholder="Enter your answer here..."
                    value={currentAnswer}
                    onChange={(e) => saveAnswer(currentQuestion.id, e.target.value)}
                    className="min-h-[120px]"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentQuestionIndex === examData.questions.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-secondary-600 hover:bg-secondary-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            ) : (
              <Button onClick={() => navigateToQuestion(currentQuestionIndex + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
