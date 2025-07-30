import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  MapPin,
  Calendar,
  User,
  PlayCircle,
  Upload,
  FileText,
} from "lucide-react";
import toast from 'react-hot-toast';
import { useSocket } from "@/contexts/SocketContext";

interface Task {
  id: string;
  _id?: string;
  title: string;
  description: string;
  project: string;
  location: string;
  locationLink?: string;
  assignedBy: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "assigned" | "in_progress" | "completed" | "delayed";
  deadline: string;
  assignedDate: string;
  startedDate?: string;
  completedDate?: string;
  progress: number;
  estimatedHours: number;
  actualHours?: number;
  files?: Array<{
    name: string;
    originalName?: string;
    filename?: string;
    path?: string;
    url?: string;
    size?: number;
    mimetype?: string;
  }>;
  projectFiles?: Array<{
    name: string;
    originalName?: string;
    filename?: string;
    path?: string;
    url?: string;
    size?: number;
    mimetype?: string;
  }>;
}

const TechnicianDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [delayReason, setDelayReason] = useState("");

  // State for tasks - Fetched from backend
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  const { socket } = useSocket();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const res = await fetch("https://cosmicproject-backend-1.onrender.com/api/profile", { headers });
    const data = await res.json();
    if (data.status === "success") {
      setUserProfile(data.data);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePicture", file);
    await fetch("https://cosmicproject-backend-1.onrender.com/api/profile/picture", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    await fetchUserProfile();
  };

  // Fetch technician data from backend
  useEffect(() => {
    fetchUserProfile();
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Fetch technician's assigned tasks
    fetch("https://cosmicproject-backend-1.onrender.com/api/technician/tasks", { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setAllTasks(data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Project created
    socket.on("project_created", (data) => {
      toast.success(`New project "${data.project.siteName}" created.`);
    });
    // Task assigned
    socket.on("task_assigned", (data) => {
      toast.success(`You have been assigned a new task: "${data.task.title}".`);
    });
    // Task status updated
    socket.on("task_status_updated", (data) => {
      console.log("Received real-time update (technician):", data);
      toast(`Task "${data.task.title}" status updated to "${data.task.status}".`);
      // Optimistically update the task in state
      setAllTasks((prevTasks) => {
        const idx = prevTasks.findIndex((t) => t._id === data.task._id || t.id === data.task._id);
        if (idx !== -1) {
          const updated = [...prevTasks];
          updated[idx] = { ...updated[idx], ...data.task };
          return updated;
        }
        return prevTasks;
      });
    });
    // Report submitted
    socket.on("report_submitted", (data) => {
      toast.success(`A report was submitted for task "${data.report.task}".`);
    });
    return () => {
      socket.off("project_created");
      socket.off("task_assigned");
      socket.off("task_status_updated");
      socket.off("report_submitted");
    };
  }, [socket]);

  // Technician dashboard stats - calculated from actual tasks
  const assignedTasksCount = allTasks.filter(
    (task) => task.status === "assigned",
  ).length;
  const inProgressTasksCount = allTasks.filter(
    (task) => task.status === "in_progress",
  ).length;
  const completedTasksCount = allTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const delayedTasksCount = allTasks.filter(
    (task) => task.status === "delayed",
  ).length;

  const stats = [
    {
      title: "Assigned Tasks",
      value: assignedTasksCount,
      description: "Current active assignments",
      icon: ClipboardList,
    },
    {
      title: "In Progress",
      value: inProgressTasksCount,
      description: "Currently working on",
      icon: Clock,
    },
    {
      title: "Completed",
      value: completedTasksCount,
      description: "This month",
      icon: CheckCircle,
    },
    {
      title: "Delayed",
      value: delayedTasksCount,
      description: "Require attention",
      icon: AlertTriangle,
    },
  ];

  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || task.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-pending text-pending-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500 text-white";
      case "in_progress":
        return "bg-pending text-pending-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "delayed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleTaskAction = (task: Task, action: string) => {
    setSelectedTask(task);
    if (action === "view") {
      setIsTaskDetailOpen(true);
    } else if (action === "update") {
      setNewStatus(task.status);
      setIsUpdateStatusOpen(true);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedTask || !newStatus) {
      alert("Please select a status");
      return;
    }
    if (newStatus === "delayed" && (!delayReason || delayReason.trim() === "")) {
      alert("Please provide a delay reason when reporting delay.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cosmicproject-backend-1.onrender.com/api/technician/tasks/${selectedTask.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            comment: statusComment,
            files: uploadedFiles.map((file) => file.name),
            ...(newStatus === "delayed" ? { delayReason } : {}),
          }),
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        // Refresh the tasks list
        const tasksResponse = await fetch(
          "https://cosmicproject-backend-1.onrender.com/api/technician/tasks",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const tasksData = await tasksResponse.json();
        if (tasksData.status === "success") {
          setAllTasks(tasksData.data);
        }

        alert(
          `✅ Task "${selectedTask.title}" status updated to "${newStatus.replace("_", " ")}"${statusComment ? ` with comment: "${statusComment}"` : ""}`,
        );

        setStatusComment("");
        setUploadedFiles([]);
        setIsUpdateStatusOpen(false);
        setSelectedTask(null);
        setDelayReason("");
      } else {
        alert(`❌ Failed to update task status: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("❌ Failed to update task status. Please try again.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout
      userRole="technician"
      userName={userProfile?.name || "Technician"}
      userEmail={userProfile?.email || "technician@cosmicsolutions.com"}
      userProfilePicture={userProfile?.profilePicture ? `https://cosmicproject-backend-1.onrender.com/${userProfile.profilePicture}` : undefined}
      onProfilePictureUpload={handleProfilePictureUpload}
    >
      <div className="mobile-container mobile-space-y max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="mobile-text-2xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 mobile-text-base">
              Welcome to your technician dashboard. Access your tasks and
              reports from the navigation menu.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Tasks Management */}
        <Card className="mobile-card">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="mobile-text-lg">Task Management</CardTitle>
                <CardDescription className="mobile-text-sm">
                  View, update, and manage your assigned tasks
                </CardDescription>
              </div>
              <div className="mobile-action-buttons">
                <div className="mobile-search">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mobile-search-input"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="mobile-select w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mobile-space-y">
              {filteredTasks.length === 0 ? (
                <div className="mobile-empty-state">
                  <ClipboardList className="mobile-empty-state-icon text-muted-foreground" />
                  <h3 className="mobile-empty-state-title">No tasks found</h3>
                  <p className="mobile-empty-state-description">
                    {allTasks.length === 0
                      ? "No tasks have been assigned to you yet. You can view or submit your tasks and reports using the navigation menu."
                      : "No tasks match your current filters."}
                  </p>
                </div>
              ) : (
                <div className="responsive-table">
                  <table className="w-full text-left">
                                          <thead>
                        <tr>
                          <th className="py-2 px-2 bg-muted/50 mobile-text-sm font-medium text-muted-foreground">
                            Task Title
                          </th>
                          <th className="py-2 px-2 bg-muted/50 mobile-text-sm font-medium text-muted-foreground">
                            Project
                          </th>
                          <th className="py-2 px-2 bg-muted/50 mobile-text-sm font-medium text-muted-foreground">
                            Location
                          </th>
                          <th className="py-2 px-2 bg-muted/50 mobile-text-sm font-medium text-muted-foreground">
                            Priority
                          </th>
                          <th className="py-2 px-2 bg-muted/50 mobile-text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="py-2 px-2 bg-muted/50 mobile-text-sm font-medium text-muted-foreground">
                            Deadline
                          </th>
                          <th className="py-2 px-2 bg-muted/50 mobile-text-sm font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-2 px-2 mobile-text-sm text-foreground">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-medium">{task.title}</h4>
                            </div>
                          </td>
                          <td className="py-2 px-2 mobile-text-sm text-foreground">
                            {task.project}
                          </td>
                          <td className="py-2 px-2 mobile-text-sm text-foreground">
                            {task.location}
                          </td>
                          <td className="py-2 px-2 mobile-text-sm text-foreground">
                            <Badge
                              variant="outline"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 mobile-text-sm text-foreground">
                            <Badge
                              variant="outline"
                              className={getStatusColor(task.status)}
                            >
                              {task.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 mobile-text-sm text-foreground">
                            {new Date(task.deadline).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-2 mobile-text-sm text-foreground">
                            <div className="mobile-action-buttons">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTaskAction(task, "view")}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              {task.status !== "completed" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleTaskAction(task, "update")}
                                >
                                  {task.status === "assigned" ? (
                                    <>
                                      <PlayCircle className="h-3 w-3 mr-1" />
                                      Start
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="h-3 w-3 mr-1" />
                                      Update
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Task Detail Dialog */}
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <DialogContent className="mobile-dialog-content max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mobile-text-lg">{selectedTask?.title}</DialogTitle>
              <DialogDescription className="mobile-text-sm">
                Task details and information
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="mobile-space-y">
                <div className="mobile-grid-2">
                  <div>
                    <Label className="mobile-text-sm font-medium">Project</Label>
                    <p className="mobile-text-sm text-muted-foreground">
                      {selectedTask.project}
                    </p>
                  </div>
                  <div>
                    <Label className="mobile-text-sm font-medium">Location</Label>
                    <p className="mobile-text-sm text-muted-foreground">
                      {selectedTask.location}
                    </p>
                  </div>
                  <div>
                    <Label className="mobile-text-sm font-medium">Assigned By</Label>
                    <p className="mobile-text-sm text-muted-foreground">
                      {selectedTask.assignedBy}
                    </p>
                  </div>
                  <div>
                    <Label className="mobile-text-sm font-medium">Deadline</Label>
                    <p className="mobile-text-sm text-muted-foreground">
                      {new Date(selectedTask.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="mobile-text-sm font-medium">Priority</Label>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(selectedTask.priority)}
                    >
                      {selectedTask.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label className="mobile-text-sm font-medium">Status</Label>
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedTask.status)}
                    >
                      {selectedTask.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="mobile-text-sm font-medium">Description</Label>
                  <p className="mobile-text-sm text-muted-foreground mt-1">
                    {selectedTask.description}
                  </p>
                </div>

                {/* Location Link */}
                {selectedTask.locationLink && (
                  <div>
                    <Label className="text-sm font-medium">Location Link</Label>
                    <div className="mt-1">
                      <a
                        href={selectedTask.locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-medium flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Open Location in Maps
                      </a>
                    </div>
                  </div>
                )}

                {/* Files Section */}
                {(selectedTask.files && selectedTask.files.length > 0) || (selectedTask.projectFiles && selectedTask.projectFiles.length > 0) ? (
                  <div>
                    <Label className="text-sm font-medium">Attached Files</Label>
                    <div className="mt-2 space-y-3">
                      {/* Task Files */}
                      {selectedTask.files && selectedTask.files.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-blue-700">Task Files:</span>
                          <div className="mt-2 space-y-2">
                            {selectedTask.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {file.originalName || file.name || file.filename}
                                    </p>
                                    {file.size && (
                                      <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <a
                                  href={file.url || `https://cosmicproject-backend-1.onrender.com/${file.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                                >
                                  Download
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Project Files */}
                      {selectedTask.projectFiles && selectedTask.projectFiles.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-blue-700">Project Files:</span>
                          <div className="mt-2 space-y-2">
                            {selectedTask.projectFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {file.originalName || file.name || file.filename}
                                    </p>
                                    {file.size && (
                                      <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <a
                                  href={file.url || `https://cosmicproject-backend-1.onrender.com/${file.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                                >
                                  Download
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {selectedTask.status !== "assigned" && (
                  <div>
                    <Label className="text-sm font-medium">Progress</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Completion
                        </span>
                        <span className="font-medium">
                          {selectedTask.progress}%
                        </span>
                      </div>
                      <Progress value={selectedTask.progress} className="h-2" />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsTaskDetailOpen(false)}
                  >
                    Close
                  </Button>
                  {selectedTask.status !== "completed" && (
                    <Button
                      onClick={() => {
                        setIsTaskDetailOpen(false);
                        handleTaskAction(selectedTask, "update");
                      }}
                    >
                      Update Status
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Task Status</DialogTitle>
              <DialogDescription>
                Update the status of "{selectedTask?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="status">New Status *</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">Start Working</SelectItem>
                    <SelectItem value="completed">Mark Completed</SelectItem>
                    <SelectItem value="delayed">Report Delay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  placeholder="Add comments about the task progress, issues, or completion details..."
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label>Upload Files</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="w-full sm:w-auto"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photos/Documents
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Uploaded Files:</Label>
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
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

              {newStatus === "delayed" && (
                <div>
                  <Label htmlFor="delayReason">Delay Reason *</Label>
                  <Textarea
                    id="delayReason"
                    placeholder="Enter the reason for the delay..."
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                    className="mt-2"
                    rows={2}
                    required
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateStatusOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  className="w-full sm:w-auto"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
