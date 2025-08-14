import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import UserGuide from "@/pages/UserGuide";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";
import ProctorDashboard from "@/pages/proctor/ProctorDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import ExamInterface from "@/pages/student/ExamInterface";
import Layout from "@/components/Layout";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/guide" component={UserGuide} />
        </>
      ) : (
        <Layout>
          <Route path="/" component={() => {
            const userRole = (user as any)?.role || 'student';
            switch (userRole) {
              case 'admin':
                return <AdminDashboard />;
              case 'instructor':
                return <InstructorDashboard />;
              case 'proctor':
                return <ProctorDashboard />;
              case 'student':
              default:
                return <StudentDashboard />;
            }
          }} />
          <Route path="/guide" component={UserGuide} />
          <Route path="/exam/:id" component={ExamInterface} />
        </Layout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
