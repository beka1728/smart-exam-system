import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { X, Save, FileText } from "lucide-react";

const examFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  aiEnabled: z.boolean().default(true),
  shuffleQuestions: z.boolean().default(true),
  showResults: z.boolean().default(false),
  maxAttempts: z.number().min(1).default(1),
  difficultyMix: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }),
});

type ExamFormData = z.infer<typeof examFormSchema>;

interface ExamCreationFormProps {
  onClose: () => void;
}

export default function ExamCreationForm({ onClose }: ExamCreationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [difficultyValues, setDifficultyValues] = useState({ easy: 40, medium: 40, hard: 20 });

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 90,
      aiEnabled: true,
      shuffleQuestions: true,
      showResults: false,
      maxAttempts: 1,
      difficultyMix: difficultyValues,
    },
  });

  const createExamMutation = useMutation({
    mutationFn: async (data: ExamFormData) => {
      const response = await apiRequest('POST', '/api/exams', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exam Created",
        description: "Your exam has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create exam",
        variant: "destructive",
      });
    },
  });

  const handleDifficultyChange = (type: keyof typeof difficultyValues, value: number[]) => {
    const newValue = value[0];
    const newValues = { ...difficultyValues, [type]: newValue };
    
    // Ensure total doesn't exceed 100%
    const total = Object.values(newValues).reduce((sum, val) => sum + val, 0);
    if (total <= 100) {
      setDifficultyValues(newValues);
      form.setValue('difficultyMix', newValues);
    }
  };

  const handleSaveDraft = (data: ExamFormData) => {
    createExamMutation.mutate({ ...data, status: 'draft' } as any);
  };

  const onSubmit = (data: ExamFormData) => {
    const total = data.difficultyMix.easy + data.difficultyMix.medium + data.difficultyMix.hard;
    if (total !== 100) {
      toast({
        title: "Invalid Configuration",
        description: "Difficulty percentages must add up to 100%",
        variant: "destructive",
      });
      return;
    }
    
    createExamMutation.mutate(data);
  };

  const totalPercentage = difficultyValues.easy + difficultyValues.medium + difficultyValues.hard;

  return (
    <Card className="shadow-material-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary-600" />
            Create New Exam
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Midterm Calculus Exam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="90" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the exam content and expectations..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Difficulty Mix Configuration */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Difficulty Distribution
                <span className={`ml-2 text-xs ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                  ({totalPercentage}%)
                </span>
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="block text-xs font-medium text-gray-700 mb-2">
                    Easy Questions
                  </Label>
                  <Slider
                    value={[difficultyValues.easy]}
                    onValueChange={(value) => handleDifficultyChange('easy', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{difficultyValues.easy}%</span>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-gray-700 mb-2">
                    Medium Questions
                  </Label>
                  <Slider
                    value={[difficultyValues.medium]}
                    onValueChange={(value) => handleDifficultyChange('medium', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{difficultyValues.medium}%</span>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-gray-700 mb-2">
                    Hard Questions
                  </Label>
                  <Slider
                    value={[difficultyValues.hard]}
                    onValueChange={(value) => handleDifficultyChange('hard', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{difficultyValues.hard}%</span>
                </div>
              </div>
            </div>

            {/* AI Configuration */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-robot text-primary-600 mr-2"></i>
                AI Enhancement Options
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="aiEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Generate question variants for each student</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shuffleQuestions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Shuffle question order per student</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showResults"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Show results to students immediately</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="maxAttempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Attempts</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline"
                onClick={form.handleSubmit(handleSaveDraft)}
                disabled={createExamMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button 
                type="submit"
                disabled={createExamMutation.isPending || totalPercentage !== 100}
              >
                {createExamMutation.isPending ? 'Creating...' : 'Create Exam'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
