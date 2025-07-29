import React, { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SuperAdminReports = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [quickStats, setQuickStats] = useState([
    {
      title: "Reports Generated",
      value: "0",
      change: "+0%",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Active Projects",
      value: "0",
      change: "+0%",
      icon: ClipboardList,
      color: "text-pending",
    },
  ]);
  const [isTaskReportOpen, setIsTaskReportOpen] = useState(false);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [selectedReportTaskId, setSelectedReportTaskId] = useState<string | null>(null);
  const [isDownloadingTaskPdf, setIsDownloadingTaskPdf] = useState(false);


  const generateReport = async (type: string, format: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to generate reports.");
      return;
    }

    setIsGeneratingReport(true);
    const reportData = {
      type,
      format,
    };

    try {
      console.log("Generating report:", reportData);
      
      // Use the correct endpoint for project summary report
      const response = await fetch("http://localhost:5000/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to generate report: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (contentType && contentType.includes("application/pdf")) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${type.replace(/\s+/g, '_')}_report.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        console.log("PDF downloaded successfully");
      } else {
        const responseData = await response.json();
        console.log("Response data:", responseData);
        if (responseData.status === "error") {
          throw new Error(responseData.message || "Failed to generate report");
        }
      }
    } catch (err) {
      console.error("Error generating report:", err);
      alert(`Failed to generate report: ${err.message}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const reportTemplates = [
    {
      id: "project-summary",
      title: "Project Summary Report",
      description:
        "Comprehensive overview of all projects, their status, and progress",
      icon: ClipboardList,
      metrics: [
        "Total Projects",
        "Completion Rate",
        "Average Duration",
        "Budget Analysis",
      ],
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Fetch user profile
    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUserProfile(data.data);
        }
      })
      .catch(console.error);

    fetch("http://localhost:5000/api/superadmin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setQuickStats([
            {
              title: "Reports Generated",
              value: data.data.reportsGenerated || "0",
              change: "+12%",
              icon: FileText,
              color: "text-primary",
            },
            {
              title: "Active Projects",
              value: data.data.inProgressProjects?.toString() || "0",
              change: "+3%",
              icon: ClipboardList,
              color: "text-pending",
            },
          ]);
        }
      });
  }, []);

  // Fetch all projects and flatten tasks
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/api/superadmin/projects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const projects = Array.isArray(data.data.projects) ? data.data.projects : [];
          const tasks = projects.flatMap((project) =>
            (project.tasks || []).map((task) => ({
              ...task,
              projectName: project.siteName,
            }))
          );
          setAllTasks(tasks);
        }
      });
  }, []);

  const handleDownloadTaskPdf = async () => {
    if (!selectedReportTaskId) return;
    setIsDownloadingTaskPdf(true);
    const token = localStorage.getItem("token");
    const selectedTask = allTasks.find((t) => t._id === selectedReportTaskId || t.id === selectedReportTaskId);
    try {
      const response = await fetch("http://localhost:5000/api/reports/task-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tasks: [selectedTask] }),
      });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedTask.title.replace(/\s+/g, '_')}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download task report: " + err.message);
    } finally {
      setIsDownloadingTaskPdf(false);
    }
  };

  return (
    <DashboardLayout
      userRole="super-admin"
      userName={userProfile?.name || "System Administrator"}
      userEmail={userProfile?.email || "admin@cosmicsolutions.com"}
      userProfilePicture={userProfile?.profilePicture ? `http://localhost:5000/${userProfile.profilePicture}` : undefined}
    >
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive reports and analyze system performance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    <span className="text-xs text-success font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Project Summary Report Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Project Summary Report
            </CardTitle>
            <CardDescription>
              Comprehensive overview of all projects, their status, and progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Key Metrics:
                </Label>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Total Projects
                  </li>
                  <li className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Completion Rate
                  </li>
                  <li className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Average Duration
                  </li>
                  <li className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Budget Analysis
                  </li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport("Project Summary", "pdf")}
                  disabled={isGeneratingReport}
                  className="flex-1"
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>   
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminReports;