import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import TabNavigation from "@/components/layout/tab-navigation";
import Dashboard from "@/pages/dashboard";
import QuestionGenerator from "@/components/question-generator";
import StudentManagement from "@/components/student-management";
import Analytics from "@/components/analytics";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/generator" component={QuestionGenerator} />
          <Route path="/students" component={StudentManagement} />
          <Route path="/analytics" component={Analytics} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
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
