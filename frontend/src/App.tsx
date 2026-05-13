import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HRDashboard from "./pages/hr/HRDashboard";
import HREmployees from "./pages/hr/HREmployees";
import HREmployeeDetails from "./pages/hr/HREmployeeDetails";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* HR routes */}
              <Route
                element={
                  <ProtectedRoute roles={["HR"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/hr" element={<HRDashboard />} />
                <Route path="/hr/employees" element={<HREmployees />} />
                <Route path="/hr/employees/:id" element={<HREmployeeDetails />} />
                <Route path="/hr/settings" element={<Navigate to="/hr" replace />} />
              </Route>

              {/* Create-employee form: HR only, rendered without dashboard chrome */}
              <Route
                path="/register"
                element={
                  <ProtectedRoute roles={["HR"]}>
                    <Register />
                  </ProtectedRoute>
                }
              />

              {/* Employee routes */}
              <Route
                element={
                  <ProtectedRoute roles={["Employee"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/employee/profile" element={<EmployeeProfile />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
