import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SocketProvider } from "@/contexts/SocketContext";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import SuperAdminProjects from "./pages/SuperAdminProjects";
import SuperAdminReports from "./pages/SuperAdminReports";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerProjects from "./pages/Myprojects";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import NotFound from "./pages/NotFound";
import MyProjectsPage from "./pages/Myprojects";
import TasksPage from "./pages/task"; // Removed duplicate import
import TechnicianReports from "./pages/TechnicianReports";
import TechnicianTasks from "./pages/TechnicianTasks";
import ManagerTechniciansPage from "./pages/ManagerTechniciansPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';
import TestToast from "./pages/TestToast";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <TooltipProvider>
            <Toaster position="top-right" />
            <BrowserRouter>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              
              {/* Test Route */}
              <Route path="/test-toast" element={<TestToast />} />

              {/* Super Admin Routes */}
              <Route
                path="/superadmin"
                element={
                  <ProtectedRoute allowedRoles={["superadmin", "super-admin"]}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/superadmin/projects"
                element={
                  <ProtectedRoute allowedRoles={["superadmin", "super-admin"]}>
                    <SuperAdminProjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/superadmin/reports"
                element={
                  <ProtectedRoute allowedRoles={["superadmin", "super-admin"]}>
                    <SuperAdminReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/superadmin/settings"
                element={
                  <ProtectedRoute allowedRoles={["superadmin", "super-admin"]}>
                    <SuperAdminSettings />
                  </ProtectedRoute>
                }
              />

              {/* Manager Routes */}
              <Route
                path="/manager"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/projects"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <MyProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/technicians"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerTechniciansPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/tasks"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <TasksPage />
                  </ProtectedRoute>
                }
              />

              {/* Technician Routes */}
              <Route
                path="/technician"
                element={
                  <ProtectedRoute allowedRoles={["technician"]}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technician/tasks"
                element={
                  <ProtectedRoute allowedRoles={["technician"]}>
                    <TechnicianTasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technician/reports"
                element={
                  <ProtectedRoute allowedRoles={["technician"]}>
                    <TechnicianReports />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SocketProvider>
    </NotificationProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
