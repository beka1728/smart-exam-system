import { useQuery } from "@tanstack/react-query";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Analytics {
  totalStudents: number;
  totalQuestions: number;
  aiAccuracy: number;
  uniquenessRate: number;
  subjectDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ['/api/analytics'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const performanceMetrics = [
    { value: '2.3s', label: 'Avg Generation Time', color: 'blue' },
    { value: '99.8%', label: 'Success Rate', color: 'green' },
    { value: analytics?.totalQuestions || 0, label: 'Total Questions', color: 'purple' },
    { value: '4.9', label: 'User Rating', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Question Generation Trends</h3>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="mx-auto mb-2" size={48} />
                <p>Chart visualization would be here</p>
                <p className="text-sm">Showing generation patterns over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Subject Distribution</h3>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="mx-auto mb-2" size={48} />
                <p>Pie chart would be here</p>
                <p className="text-sm">Breakdown by subject area</p>
                {analytics?.subjectDistribution && (
                  <div className="mt-4 text-xs">
                    {Object.entries(analytics.subjectDistribution).map(([subject, count]) => (
                      <div key={subject} className="flex justify-between">
                        <span className="capitalize">{subject}:</span>
                        <span>{count as number}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold text-${metric.color}-600`}>
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Difficulty Distribution</h3>
          {analytics?.difficultyDistribution && (
            <div className="space-y-4">
              {Object.entries(analytics.difficultyDistribution).map(([difficulty, count]) => {
                const percentage = ((count as number) / analytics.totalQuestions) * 100;
                const colorClass = difficulty === 'Easy' ? 'bg-green-500' : 
                                 difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
                
                return (
                  <div key={difficulty} className="flex items-center justify-between">
                    <span className="capitalize">{difficulty}</span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colorClass} h-2 rounded-full`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Performance Trends</h3>
          <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="mx-auto mb-2" size={48} />
              <p>Performance trend chart would be here</p>
              <p className="text-sm">Showing AI accuracy and generation speed over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
