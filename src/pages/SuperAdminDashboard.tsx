import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import { API_BASE_URL, FILE_BASE_URL } from "@/config/environment";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Search,
  Filter,
  FileText,
  MapPin,
  TrendingUp,
  Upload,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useSocket } from "@/contexts/SocketContext";
import SocketTest from "@/components/ui/SocketTest";

const SuperAdminDashboard = () => {
  // State for stats and projects
  const [stats, setStats] = useState<any>({
    managersCount: 0,
    projectsCount: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [report, setReport] = useState(null);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    clientName: "",
    siteName: "",
    location: "",
    mapLink: "",
    priority: "",
    deadline: "",
    description: "",
    notes: "",
    assignedManager: "",
    files: [] as File[],
  });

  // User form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Add state and handler at the top of the component
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const { socket } = useSocket();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
<<<<<<< HEAD
    const res = await fetch("https://cosmicproject-backend-1.onrender.com/api/profile", { headers });
=======
    const res = await fetch(`${API_BASE_URL}/profile`, { headers });
>>>>>>> origin/master
    const data = await res.json();
    if (data.status === "success") {
      setUserProfile(data.data);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePicture", file);
<<<<<<< HEAD
    await fetch("https://cosmicproject-backend-1.onrender.com/api/profile/picture", {
=======
          await fetch(`${API_BASE_URL}/profile/picture`, {
>>>>>>> origin/master
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    await fetchUserProfile();
  };

  // Fetch stats, projects, and managers from backend
  useEffect(() => {
    fetchUserProfile();

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Fetch user profile
<<<<<<< HEAD
    // fetch("https://cosmicproject-backend-1.onrender.com/api/profile", { headers })
=======
    // fetch("http://localhost:5000/api/profile", { headers })
>>>>>>> origin/master
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.status === "success") {
    //       setUserProfile(data.data);
    //     }
    //   })
    //   .catch(console.error);

<<<<<<< HEAD
    fetch("https://cosmicproject-backend-1.onrender.com/api/superadmin/stats", { headers })
=======
          fetch(`${API_BASE_URL}/superadmin/stats`, { headers })
>>>>>>> origin/master
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setStats(data.data);
        }
      })
      .catch(console.error);

<<<<<<< HEAD
    fetch("https://cosmicproject-backend-1.onrender.com/api/superadmin/projects", { headers })
=======
          fetch(`${API_BASE_URL}/superadmin/projects`, { headers })
>>>>>>> origin/master
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProjects(Array.isArray(data.data.projects) ? data.data.projects : []);
        }
      })
      .catch(console.error);

<<<<<<< HEAD
    fetch("https://cosmicproject-backend-1.onrender.com/api/superadmin/managers", { headers })
=======
          fetch(`${API_BASE_URL}/superadmin/managers`, { headers })
>>>>>>> origin/master
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setManagers(data.data);
        }
      })
      .catch(console.error);

<<<<<<< HEAD
    fetch("https://cosmicproject-backend-1.onrender.com/api/reports/overview", { headers })
=======
          fetch(`${API_BASE_URL}/reports/overview`, { headers })
>>>>>>> origin/master
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setReport(data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Project created
    socket.on("project_created", (data) => {
      toast.success(`New project "${data.project.siteName}" created and assigned.`);
    });
    // Task assigned
    socket.on("task_assigned", (data) => {
      toast.success(`Task "${data.task.title}" assigned to technician.`);
    });
    // Task status updated
    socket.on("task_status_updated", (data) => {
      console.log("Received real-time update (superadmin):", data);
      toast(`Task "${data.task.title}" status updated to "${data.task.status}".`);
      // Optimistically update the project in state
      if (data.project) {
        setProjects((prevProjects) => {
          const idx = prevProjects.findIndex((p) => p._id === data.project._id || p.id === data.project._id);
          if (idx !== -1) {
            const updated = [...prevProjects];
            updated[idx] = { ...updated[idx], ...data.project };
            return updated;
          }
          return prevProjects;
        });
      }
      // Re-fetch projects from backend
      const token = localStorage.getItem("token");
<<<<<<< HEAD
      fetch("https://cosmicproject-backend-1.onrender.com/api/superadmin/projects", {
=======
      fetch(`${API_BASE_URL}/superadmin/projects`, {
>>>>>>> origin/master
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setProjects(Array.isArray(data.data.projects) ? data.data.projects : []);
          }
        })
        .catch(console.error);
      // Re-fetch stats from backend
<<<<<<< HEAD
      fetch("https://cosmicproject-backend-1.onrender.com/api/superadmin/stats", {
=======
      fetch(`${API_BASE_URL}/superadmin/stats`, {
>>>>>>> origin/master
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setStats(data.data);
          }
        })
        .catch(console.error);
    });
    // Report submitted
    socket.on("report_submitted", (data) => {
      toast.success(`Report submitted for task "${data.report.task}".`);
    });
    socket.on("project_status_updated", (data) => {
      setProjects((prev) => prev.map((p) => p._id === data.projectId ? { ...p, status: data.status } : p));
      toast.success(`Project status updated to ${data.status}`);
    });
    return () => {
      socket.off("project_created");
      socket.off("task_assigned");
      socket.off("task_status_updated");
      socket.off("report_submitted");
      socket.off("project_status_updated");
    };
  }, [socket]);

  // Filtered projects for search
  const filteredProjects = projects.filter((project) =>
    project.siteName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle project creation
  const handleCreateProject = async () => {
    if (
      !projectForm.clientName ||
      !projectForm.siteName ||
      !projectForm.location ||
      !projectForm.assignedManager
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    let res, data;
    if (projectForm.files && projectForm.files.length > 0) {
      // Use FormData for file upload
      const formData = new FormData();
      Object.entries(projectForm).forEach(([key, value]) => {
        if (key === "files") {
          (value as File[]).forEach((file) => formData.append("files", file));
        } else {
          formData.append(key, value as string);
        }
      });
<<<<<<< HEAD
      res = await fetch("https://cosmicproject-backend-1.onrender.com/api/superadmin/projects", {
=======
      res = await fetch(`${API_BASE_URL}/superadmin/projects`, {
>>>>>>> origin/master
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } else {
      // No files, send JSON
<<<<<<< HEAD
      res = await fetch("https://cosmicproject-backend-1.onrender.com/api/superadmin/projects", {
=======
      res = await fetch(`${API_BASE_URL}/superadmin/projects`, {
>>>>>>> origin/master
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });
    }
    data = await res.json();
    if (res.ok && data.status === "success") {
      setProjects([...projects, data.data]);
      setProjectForm({
        clientName: "",
        siteName: "",
        location: "",
        mapLink: "",
        priority: "",
        deadline: "",
        description: "",
        notes: "",
        assignedManager: "",
        files: [],
      });
      setIsCreateProjectOpen(false);
      alert("✅ Project created successfully!");
    } else {
      alert(`Failed to create project: ${data.message || "Unknown error"}`);
    }
  };

  // File upload handler (just stores file objects in state)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProjectForm({
      ...projectForm,
      files: [...projectForm.files, ...files],
    });
  };

  const removeFile = (index: number) => {
    setProjectForm({
      ...projectForm,
      files: projectForm.files.filter((_, i) => i !== index),
    });
  };

  // Stats cards config
  const statsCards = [
    {
      title: "Active Managers",
      value: stats.managersCount,
      description: "Currently managing projects",
      icon: Users,
      badge:
        stats.managersCount > 0
          ? {
              text: "Online",
              variant: "outline" as const,
              className: "bg-success text-success-foreground",
            }
          : undefined,
    },
    {
      title: "Total Projects",
      value: stats.projectsCount,
      description: "Across all locations",
      icon: ClipboardList,
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      description: "Successfully finished",
      icon: CheckCircle,
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      description: "In progress or assigned",
      icon: AlertTriangle,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
<<<<<<< HEAD
    fetch("https://cosmicproject-backend-1.onrender.com/api/users", {
=======
          fetch(`${API_BASE_URL}/users`, {
>>>>>>> origin/master
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
  };

  const [isTeamReportsOpen, setIsTeamReportsOpen] = useState(false);
  const [isTaskReportOpen, setIsTaskReportOpen] = useState(false);
  const [selectedReportTaskId, setSelectedReportTaskId] = useState<string | null>(null);

  // Add this function in the SuperAdminDashboard component
  const handleDownloadTaskReportPDF = async () => {
    if (!selectedReportTaskId) return;
    const token = localStorage.getItem("token");
    // Find the selected task object from all projects
    const selectedTask = projects.flatMap((project) => project.tasks || []).find((t) => (t._id || t.id) === selectedReportTaskId);
    if (!selectedTask) return;
    try {
<<<<<<< HEAD
      const response = await fetch("https://cosmicproject-backend-1.onrender.com/api/reports/task-pdf", {
=======
      const response = await fetch(`${API_BASE_URL}/reports/task-pdf`, {
>>>>>>> origin/master
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tasks: [selectedTask._id] }),
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
    }
  };

  return (
    <DashboardLayout
      userRole="superadmin"
      userName={userProfile?.name || "System Administrator"}
      userEmail={userProfile?.email || "admin@cosmicsolutions.com"}
<<<<<<< HEAD
      userProfilePicture={userProfile?.profilePicture ? `https://cosmicproject-backend-1.onrender.com/${userProfile.profilePicture}` : undefined}
=======
              userProfilePicture={userProfile?.profilePicture ? `${FILE_BASE_URL}/${userProfile.profilePicture}` : undefined}
>>>>>>> origin/master
      onProfilePictureUpload={handleProfilePictureUpload}
    >
      <div className="mobile-container mobile-space-y max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="mobile-text-2xl font-bold text-foreground">
              System Overview
            </h1>
            <p className="text-muted-foreground mt-1 mobile-text-base">
              Manage your entire organization from this central dashboard.
            </p>
          </div>
          <div className="mobile-button-group">
            <Button
              onClick={() => setIsCreateProjectOpen(true)}
              className="mobile-button"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        <div className="mobile-button-group">
          <Button variant="outline" onClick={() => setIsTaskReportOpen(true)} className="mobile-button">
            <FileText className="mr-2 h-4 w-4" /> Task Report
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={statsCards} />

        {/* Socket Test Component */}
        <div className="lg:col-span-1">
          <SocketTest />
        </div>

        {/* Main Content */}
        <div className="mobile-grid-3">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="mobile-text-lg">Project Management</CardTitle>
                    <CardDescription className="mobile-text-sm">
                      All projects across the organization
                    </CardDescription>
                  </div>
                  <div className="mobile-action-buttons">
                    <div className="mobile-search">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mobile-search-input"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredProjects.length === 0 ? (
                  <div className="mobile-empty-state">
                    <ClipboardList className="mobile-empty-state-icon text-muted-foreground" />
                    <h3 className="mobile-empty-state-title">
                      No projects yet
                    </h3>
                    <p className="mobile-empty-state-description">
                      Create your first project to get started.
                    </p>
                    <Button
                      onClick={() => setIsCreateProjectOpen(true)}
                      className="mt-4 mobile-button"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  <div className="responsive-table">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow key={project._id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {project.siteName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Created{" "}
                                  {new Date(
                                    project.createdAt,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{project.clientName}</TableCell>
                            <TableCell className="max-w-32 truncate">
                              {project.location}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  project.priority === "urgent"
                                    ? "bg-destructive text-destructive-foreground"
                                    : project.priority === "high"
                                      ? "bg-orange-500 text-white"
                                      : project.priority === "medium"
                                        ? "bg-pending text-pending-foreground"
                                        : "bg-muted text-muted-foreground"
                                }
                              >
                                {project.priority?.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-blue-500 text-white"
                              >
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => handleViewProject(project)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Tasks Card */}
          <div className="lg:col-span-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div>No tasks available yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Status Timeline</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.flatMap((project) =>
                          (project.tasks || []).map((task) => (
                            <TableRow key={task._id || task.id}>
                              <TableCell>{task.title}</TableCell>
                              <TableCell>{task.status}</TableCell>
                              <TableCell>{task.assignedTo?.name || "N/A"}</TableCell>
                              <TableCell>{project.siteName || "N/A"}</TableCell>
                              <TableCell>
                                {task.deadline
                                  ? new Date(task.deadline).toLocaleDateString()
                                  : "No deadline"}
                              </TableCell>
                              <TableCell>
                                {task.statusLog && task.statusLog.length > 0 ? (
                                  <ul className="text-xs space-y-1">
                                    {task.statusLog.map((log, idx) => (
                                      <li key={idx}>
                                        <span className="font-semibold">{log.status}</span>
                                        {log.timestamp && (
                                          <span> ({new Date(log.timestamp).toLocaleString()})</span>
                                        )}
                                        {log.comment && (
                                          <span>: {log.comment}</span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span>No history</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-12 w-full"
                    onClick={() => setIsCreateProjectOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Project Dialog */}
        <Dialog
          open={isCreateProjectOpen}
          onOpenChange={setIsCreateProjectOpen}
        >
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a comprehensive project with all necessary details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    placeholder="Enter client company name"
                    value={projectForm.clientName}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        clientName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name *</Label>
                  <Input
                    id="site-name"
                    placeholder="Enter project/site name"
                    value={projectForm.siteName}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        siteName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (Address) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter complete address"
                    value={projectForm.location}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        location: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!projectForm.location}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="map-link">Map Link (Optional)</Label>
                <Input
                  id="map-link"
                  placeholder="Paste Google Maps link or coordinates"
                  value={projectForm.mapLink}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, mapLink: e.target.value })
                  }
                />
              </div>

              {/* Assign Manager */}
              <div className="space-y-2">
                <Label htmlFor="assigned-manager">Assign Manager *</Label>
                <Select
                  value={projectForm.assignedManager}
                  onValueChange={(value) =>
                    setProjectForm({ ...projectForm, assignedManager: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager to assign this project" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager: any) => (
                      <SelectItem key={manager._id || manager.id} value={manager._id || manager.id}>
                        {manager.name} - {manager.department || ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority and Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={projectForm.priority}
                    onValueChange={(value) =>
                      setProjectForm({ ...projectForm, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={projectForm.deadline}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        deadline: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Task Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the project requirements and scope"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes, special instructions, or requirements"
                  value={projectForm.notes}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Project Files</Label>
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("project-files")?.click()
                    }
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files (Plans, Specifications, etc.)
                  </Button>
                  <input
                    id="project-files"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {projectForm.files.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Uploaded Files:</Label>
                      {projectForm.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setIsCreateProjectOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                className="w-full sm:w-auto"
              >
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add the project details modal at the bottom of the return */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
              <DialogDescription>Detailed information about the selected project.</DialogDescription>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Site Name:</span> {selectedProject.siteName}
                </div>
                <div>
                  <span className="font-semibold">Client Name:</span> {selectedProject.clientName}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {selectedProject.location}
                </div>
                <div>
                  <span className="font-semibold">Manager:</span> {selectedProject.assignedManagerName || "Unassigned"}
                </div>
                <div>
                  <span className="font-semibold">Priority:</span> {selectedProject.priority}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {selectedProject.status}
                </div>
                <div>
                  <span className="font-semibold">Deadline:</span> {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : "No deadline"}
                </div>
                <div>
                  <span className="font-semibold">Description:</span> {selectedProject.description}
                </div>
                <div>
                  <span className="font-semibold">Notes:</span> {selectedProject.notes}
                </div>
                <div>
                  <span className="font-semibold">Created At:</span> {selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : ""}
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span> {selectedProject.updatedAt ? new Date(selectedProject.updatedAt).toLocaleDateString() : ""}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Report Section */}
        {report && (
          <div className="mt-8 p-4 bg-muted rounded-md">
            <h2 className="text-lg font-semibold">Project Report Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Total Projects:</strong> {report.totalProjects}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Completion Rate:</strong>{" "}
                  {(report.completionRate * 100).toFixed(2)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Average Duration:</strong> {report.averageDuration}{" "}
                  days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Report Dialog */}
        <Dialog open={isTaskReportOpen} onOpenChange={setIsTaskReportOpen}>
          <DialogContent className="mobile-dialog-content max-w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mobile-text-lg">Task Report</DialogTitle>
              <DialogDescription className="mobile-text-sm">
                View all tasks updated by technicians, including attachments and descriptions. You can also download this report as a PDF.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mobile-space-y">
              {projects.length === 0 ? (
                <div className="mobile-empty-state">
                  <div className="mobile-empty-state-icon">📋</div>
                  <h3 className="mobile-empty-state-title">No tasks available</h3>
                  <p className="mobile-empty-state-description">
                    There are no tasks to display in the report.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop Table View */}
                  <div className="hidden sm:block">
                    <div className="responsive-table">
                      <table className="w-full border-collapse bg-white">
                        <thead>
                          <tr>
                            <th className="w-12 text-center border-b border-gray-200 py-3 mobile-text-sm font-medium">Select</th>
                            <th className="border-b border-gray-200 py-3 mobile-text-sm font-medium text-left">Title</th>
                            <th className="border-b border-gray-200 py-3 mobile-text-sm font-medium text-left">Status</th>
                            <th className="border-b border-gray-200 py-3 mobile-text-sm font-medium text-left">Attachments</th>
                            <th className="border-b border-gray-200 py-3 mobile-text-sm font-medium text-left">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.flatMap((project) =>
                            (project.tasks || []).map((task) => (
                              <tr key={task._id || task.id} className="hover:bg-gray-50">
                                <td className="text-center border-b border-gray-200 py-3">
                                  <input
                                    type="radio"
                                    name="selectedTaskReport"
                                    checked={selectedReportTaskId === (task._id || task.id)}
                                    onChange={() => setSelectedReportTaskId(task._id || task.id)}
                                    className="w-4 h-4"
                                  />
                                </td>
                                <td className="border-b border-gray-200 py-3 mobile-text-sm">{task.title}</td>
                                <td className="border-b border-gray-200 py-3 mobile-text-sm">
                                  <Badge variant="outline" className="capitalize">
                                    {task.status}
                                  </Badge>
                                </td>
                                <td className="border-b border-gray-200 py-3 mobile-text-sm">
                                  {(task.files && task.files.length > 0) ? (
                                    <ul className="space-y-1">
                                      {task.files.map((file, idx) => (
                                        <li key={idx}>
                                          <a 
<<<<<<< HEAD
                                            href={file.url || `https://cosmicproject-backend-1.onrender.com/${file.path}`} 
=======
                                            href={file.url || `${FILE_BASE_URL}/${file.path}`} 
>>>>>>> origin/master
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline text-xs"
                                          >
                                            {file.originalName || file.name || file.filename || 'Attachment'}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-500 text-xs">No attachments</span>
                                  )}
                                </td>
                                <td className="border-b border-gray-200 py-3 mobile-text-sm text-gray-600">
                                  {task.description || '-'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-4">
                    {projects.flatMap((project) =>
                      (project.tasks || []).map((task) => (
                        <div 
                          key={task._id || task.id}
                          className={`mobile-card p-4 border-2 transition-colors ${
                            selectedReportTaskId === (task._id || task.id) 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedReportTaskId(task._id || task.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="selectedTaskReport"
                              checked={selectedReportTaskId === (task._id || task.id)}
                              onChange={() => setSelectedReportTaskId(task._id || task.id)}
                              className="w-4 h-4 mt-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="mobile-text-base font-medium text-gray-900 truncate">
                                  {task.title}
                                </h4>
                                <Badge variant="outline" className="capitalize mobile-text-xs">
                                  {task.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <div>
                                  <span className="mobile-text-xs font-medium text-gray-500">Description:</span>
                                  <p className="mobile-text-sm text-gray-700 mt-1">
                                    {task.description || 'No description available'}
                                  </p>
                                </div>
                                
                                <div>
                                  <span className="mobile-text-xs font-medium text-gray-500">Attachments:</span>
                                  {(task.files && task.files.length > 0) ? (
                                    <div className="mt-1 space-y-1">
                                      {task.files.map((file, idx) => (
                                        <div key={idx}>
                                          <a 
<<<<<<< HEAD
                                            href={file.url || `https://cosmicproject-backend-1.onrender.com/${file.path}`} 
=======
                                            href={file.url || `${FILE_BASE_URL}/${file.path}`} 
>>>>>>> origin/master
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mobile-text-xs text-blue-600 hover:text-blue-800 underline break-all"
                                          >
                                            {file.originalName || file.name || file.filename || 'Attachment'}
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="mobile-text-xs text-gray-500 mt-1">No attachments</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mobile-button-group mt-6">
              <Button
                variant="outline"
                onClick={() => setIsTaskReportOpen(false)}
                className="mobile-button"
              >
                Close
              </Button>
              <Button
                onClick={handleDownloadTaskReportPDF}
                disabled={!selectedReportTaskId}
                className="mobile-button"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;