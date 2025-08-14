import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain, Save, Download, RotateCcw, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TemplateForm from "./template-form";

export default function QuestionGenerator() {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("auto");
  const [options, setOptions] = useState({
    uniqueness: true,
    hints: false,
    autoCalculate: true,
    exportPdf: false,
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/questions/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedQuestions(data);
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      toast({
        title: "Questions Generated",
        description: `Successfully generated ${data.length} unique questions.`,
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!subject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject before generating questions.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({ subject, difficulty, options });
  };

  const handleSaveTemplate = () => {
    if (!subject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject before saving a template.",
        variant: "destructive",
      });
      return;
    }

    setShowTemplateForm(true);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'green';
      case 'Medium': return 'yellow';
      case 'Hard': return 'red';
      default: return 'gray';
    }
  };

  const getDifficultyBorderColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'border-green-500';
      case 'Medium': return 'border-yellow-500';
      case 'Hard': return 'border-red-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Generation Form */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Generate Lab Questions</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CheckCircle size={16} />
              <span>AI will create unique questions for each student</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Count</label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Match Students)</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                  <SelectItem value="50">50 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Advanced Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uniqueness"
                  checked={options.uniqueness}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, uniqueness: checked as boolean }))
                  }
                />
                <label htmlFor="uniqueness" className="text-sm text-blue-700">
                  Ensure 100% uniqueness
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hints"
                  checked={options.hints}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, hints: checked as boolean }))
                  }
                />
                <label htmlFor="hints" className="text-sm text-blue-700">
                  Include solution hints
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoCalculate"
                  checked={options.autoCalculate}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, autoCalculate: checked as boolean }))
                  }
                />
                <label htmlFor="autoCalculate" className="text-sm text-blue-700">
                  Auto-calculate answers
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exportPdf"
                  checked={options.exportPdf}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, exportPdf: checked as boolean }))
                  }
                />
                <label htmlFor="exportPdf" className="text-sm text-blue-700">
                  Export to PDF
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !subject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Brain className="mr-2" size={16} />
              {generateMutation.isPending ? 'Generating Questions...' : 'Generate Unique Questions'}
            </Button>
            <Button 
              variant="secondary"
              onClick={handleSaveTemplate}
            >
              <Save className="mr-2" size={16} />
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {generateMutation.isPending && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <p className="text-blue-800 font-medium">AI is generating unique questions...</p>
                <p className="text-blue-600 text-sm">Processing templates and ensuring uniqueness for each student</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">
                Generated Questions ({generatedQuestions.length})
              </h4>
              <div className="flex items-center space-x-2">
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                  <Download className="mr-2" size={14} />
                  Export All
                </Button>
                <Button variant="secondary" size="sm" onClick={handleGenerate}>
                  <RotateCcw className="mr-2" size={14} />
                  Regenerate
                </Button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question, index) => {
                const difficultyColor = getDifficultyColor(question.difficulty);
                const borderColor = getDifficultyBorderColor(question.difficulty);
                
                return (
                  <div key={index} className={`border-l-4 ${borderColor} pl-4 py-3 bg-${difficultyColor}-50 rounded-r-lg`}>
                    <div className="flex justify-between items-start mb-2">
                      <strong className={`text-sm font-semibold text-${difficultyColor}-800`}>
                        {question.studentName}
                      </strong>
                      <span className={`bg-${difficultyColor}-200 text-${difficultyColor}-800 text-xs px-2 py-1 rounded-full`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {question.questionText}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {question.uniqueId}</span>
                      <span className="flex items-center">
                        <CheckCircle className="text-green-500 mr-1" size={12} />
                        Unique
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Form Modal */}
      {showTemplateForm && (
        <TemplateForm
          onClose={() => setShowTemplateForm(false)}
          initialData={{
            subject,
            difficulty,
            questionText: generatedQuestions.length > 0 ? generatedQuestions[0].questionText : undefined
          }}
        />
      )}
    </div>
  );
}
