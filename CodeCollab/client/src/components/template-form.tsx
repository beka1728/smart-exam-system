import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TemplateFormProps {
  onClose: () => void;
  initialData?: {
    subject: string;
    difficulty: string;
    questionText?: string;
  };
}

export default function TemplateForm({ onClose, initialData }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || "",
    difficulty: initialData?.difficulty || "medium",
    template: initialData?.questionText || "",
    variables: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/question-templates", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/question-templates'] });
      toast({
        title: "Template Saved",
        description: "Question template has been successfully saved.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.template.trim()) {
      newErrors.template = "Template text is required";
    }
    if (!formData.difficulty) {
      newErrors.difficulty = "Difficulty level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Parse variables from comma-separated string
    const variablesArray = formData.variables
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    createMutation.mutate({
      ...formData,
      variables: { placeholders: variablesArray },
    });
  };

  const extractPlaceholders = (text: string) => {
    const matches = text.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)).join(', ') : '';
  };

  const handleTemplateChange = (value: string) => {
    handleInputChange("template", value);
    // Auto-extract placeholders from template
    const placeholders = extractPlaceholders(value);
    if (placeholders) {
      handleInputChange("variables", placeholders);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Save Question Template
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleInputChange("subject", value)}
                >
                  <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange("difficulty", value)}
                >
                  <SelectTrigger className={errors.difficulty ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty && (
                  <p className="text-sm text-red-500">{errors.difficulty}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Question Template</Label>
              <Textarea
                id="template"
                value={formData.template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                placeholder="Enter your question template using {placeholder} for variables..."
                rows={4}
                className={errors.template ? "border-red-500" : ""}
              />
              {errors.template && (
                <p className="text-sm text-red-500">{errors.template}</p>
              )}
              <p className="text-xs text-gray-500">
                Use curly braces for variables, e.g., "Calculate the {'{measurement}'} of a {'{object}'} with {'{property}'} = {'{value}'} {'{unit}'}"
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variables">Variables (auto-detected)</Label>
              <Input
                id="variables"
                type="text"
                value={formData.variables}
                onChange={(e) => handleInputChange("variables", e.target.value)}
                placeholder="measurement, object, property, value, unit"
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                Variables are automatically extracted from your template placeholders
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Template Preview</h4>
              <p className="text-sm text-blue-700">
                {formData.template || "Enter a template above to see the preview..."}
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                {createMutation.isPending ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}