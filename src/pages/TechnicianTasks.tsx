

import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  ClipboardList,
  Search,
  Eye,
  PlayCircle,
  Upload,
  Calendar,
  CheckCircle,
  FileText,
  Trash2,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  location: string;
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
}

interface Report {
  id: string;
  taskId: string;
  taskTitle: string;
  workSummary: string;
  dateOfWork: string;
  images: File[];
  submittedAt: string;
  status: "submitted" | "approved" | "rejected";
}

const TechnicianTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isStartTaskOpen, setIsStartTaskOpen] = useState(false);
  const [isStandaloneReportOpen, setIsStandaloneReportOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusDescription, setStatusDescription] = useState("");
  
  // Report submission states
  const [taskTitle, setTaskTitle] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [dateOfWork, setDateOfWork] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Sample tasks for testing
  const [allTasks, setAllTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "CCTV Camera Installation",
      description: "Install 8 HD security cameras in the main office building",
      project: "Office Complex Security Setup",
      location: "Downtown Office Building",
      assignedBy: "Project Manager",
      priority: "high",
      status: "assigned",
      deadline: "2024-02-15",
      assignedDate: "2024-01-15",
      progress: 0,
      estimatedHours: 8,
    },
    {
      id: "task-2",
      title: "Network Cable Setup",
      description: "Run ethernet cables for the new CCTV system",
      project: "Office Complex Security Setup",
      location: "Downtown Office Building",
      assignedBy: "Project Manager",
      priority: "medium",
      status: "in_progress",
      deadline: "2024-02-10",
      assignedDate: "2024-01-12",
      startedDate: "2024-01-13",
      progress: 65,
      estimatedHours: 6,
      actualHours: 4,
    },
  ]);

  const [submittedReports, setSubmittedReports] = useState<Report[]>([]);

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
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500 text-white";
      case "in_progress":
        return "bg-yellow-500 text-black";
      case "completed":
        return "bg-green-500 text-white";
      case "delayed":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleTaskAction = (task: Task, action: string) => {
    setSelectedTask(task);
    if (action === "view") {
      setIsTaskDetailOpen(true);
    } else if (action === "update") {
      setNewStatus(task.status);
      setIsUpdateStatusOpen(true);
    } else if (action === "start") {
      // Initialize form with current date and task title
      setTaskTitle(task.title);
      setDateOfWork(new Date().toISOString().split('T')[0]);
      setWorkSummary("");
      setUploadedImages([]);
      setIsStartTaskOpen(true);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartTaskWithReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTask) {
      alert("No task selected");
      return;
    }

    // Validation
    if (!workSummary || !dateOfWork) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Create report data
      const reportData: Report = {
        id: Date.now().toString(),
        taskId: selectedTask.id,
        taskTitle: selectedTask.title,
        workSummary,
        dateOfWork,
        images: uploadedImages,
        submittedAt: new Date().toISOString(),
        status: "submitted",
      };

      // Update task status to in_progress
      const updatedTask = {
        ...selectedTask,
        status: "in_progress" as Task["status"],
        startedDate: new Date().toISOString(),
        progress: 25, // Starting progress
      };

      // Update task in state
      setAllTasks(allTasks.map((task) =>
        task.id === selectedTask.id ? updatedTask : task
      ));

      // Add report to submitted reports
      setSubmittedReports((prev) => [reportData, ...prev]);

      // Reset form and close dialog
      setTaskTitle("");
      setWorkSummary("");
      setDateOfWork("");
      setUploadedImages([]);
      setIsStartTaskOpen(false);
      setSelectedTask(null);

      alert(
        `✅ Task started and report submitted successfully!\n\n` +
        `Task: ${selectedTask.title}\n` +
        `Status: Started (In Progress)\n` +
        `Work Date: ${new Date(dateOfWork).toLocaleDateString()}\n` +
        `Images: ${uploadedImages.length} file(s)\n\n` +
        `Your task has been started and the initial report has been sent to the project manager for review.`
      );

    } catch (error) {
      alert("Failed to start task and submit report. Please try again.");
    }
  };

  const handleStandaloneReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!taskTitle || !workSummary || !dateOfWork) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Create new report
      const newReport: Report = {
        id: Date.now().toString(),
        taskId: "", // Standalone report
        taskTitle,
        workSummary,
        dateOfWork,
        images: uploadedImages,
        submittedAt: new Date().toISOString(),
        status: "submitted",
      };

      // Add to submitted reports
      setSubmittedReports((prev) => [newReport, ...prev]);

      // Reset form
      setTaskTitle("");
      setWorkSummary("");
      setDateOfWork("");
      setUploadedImages([]);

      alert(
        `✅ Report submitted successfully!\n\n` +
        `Task: ${taskTitle}\n` +
        `Date: ${new Date(dateOfWork).toLocaleDateString()}\n` +
        `Images: ${uploadedImages.length} file(s)\n\n` +
        `Your report has been sent to the project manager for review.`
      );

      setIsStandaloneReportOpen(false);
    } catch (error) {
      alert("Failed to submit report. Please try again.");
    }
  };

  const handleStatusUpdate = () => {
    if (!selectedTask || !newStatus) {
      alert("Please select a status");
      return;
    }

    const updatedTask = {
      ...selectedTask,
      status: newStatus as Task["status"],
      ...(newStatus === "in_progress" && !selectedTask.startedDate
        ? { startedDate: new Date().toISOString() }
        : {}),
      ...(newStatus === "completed"
        ? { completedDate: new Date().toISOString(), progress: 100 }
        : {}),
    };

    setAllTasks(
      allTasks.map((task) =>
        task.id === selectedTask.id ? updatedTask : task,
      ),
    );

    alert(
      `Task "${selectedTask.title}" status updated to "${newStatus.replace("_", " ")}"\n\nWork Progress Description: ${statusDescription}`,
    );

    setIsUpdateStatusOpen(false);
    setSelectedTask(null);
    setStatusDescription("");
  };

  return (
    <DashboardLayout
      userRole="technician"
      userName="Field Technician"
      userEmail="technician@cosmicsolutions.com"
    >
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              My Tasks
            </h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              View and manage your assigned tasks.
            </p>
          </div>
          <Button 
            onClick={() => {
              setTaskTitle("");
              setWorkSummary("");
              setDateOfWork(new Date().toISOString().split('T')[0]);
              setUploadedImages([]);
              setIsStandaloneReportOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <FileText className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle>Task List</CardTitle>
                <CardDescription>All tasks assigned to you</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
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
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                <p className="mt-2 text-gray-600">
                  {allTasks.length === 0
                    ? "No tasks have been assigned to you yet. You can view or submit your tasks and reports using the navigation menu."
                    : "No tasks match your current filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-600">
                              {task.project}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(task.status)}
                          >
                            {task.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.assignedDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.deadline)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
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
                                onClick={() => 
                                  task.status === "assigned" 
                                    ? handleTaskAction(task, "start")
                                    : handleTaskAction(task, "update")
                                }
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        {submittedReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your recently submitted reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submittedReports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{report.taskTitle}</h4>
                        <p className="text-sm text-gray-600">
                          Work Date: {formatDate(report.dateOfWork)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {report.workSummary}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Submitted: {new Date(report.submittedAt).toLocaleString()}
                      </span>
                      <span>{report.images.length} image(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Detail Dialog */}
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>
                Task details and information
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Project:</strong> {selectedTask.project}
                  </div>
                  <div>
                    <strong>Location:</strong> {selectedTask.location}
                  </div>
                  <div>
                    <strong>Assigned By:</strong> {selectedTask.assignedBy}
                  </div>
                  <div>
                    <strong>Deadline:</strong>{" "}
                    {formatDate(selectedTask.deadline)}
                  </div>
                  <div>
                    <strong>Priority:</strong>
                    <Badge
                      className={`ml-2 ${getPriorityColor(selectedTask.priority)}`}
                    >
                      {selectedTask.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <Badge
                      className={`ml-2 ${getStatusColor(selectedTask.status)}`}
                    >
                      {selectedTask.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1">{selectedTask.description}</p>
                </div>
                {selectedTask.status !== "assigned" && (
                  <div>
                    <strong>Progress:</strong>
                    <div className="mt-2">
                      <Progress value={selectedTask.progress} className="h-2" />
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedTask.progress}% Complete
                      </div>
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
                        if (selectedTask.status === "assigned") {
                          handleTaskAction(selectedTask, "start");
                        } else {
                          handleTaskAction(selectedTask, "update");
                        }
                      }}
                    >
                      {selectedTask.status === "assigned" ? "Start Task" : "Update Status"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Start Task with Report Dialog */}
        <Dialog open={isStartTaskOpen} onOpenChange={setIsStartTaskOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <PlayCircle className="h-5 w-5" />
                <span>Start Task & Submit Initial Report</span>
              </DialogTitle>
              <DialogDescription>
                Start working on "{selectedTask?.title}" and submit your initial work report
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleStartTaskWithReport} className="space-y-4">
              {/* Task Info Display */}
              {selectedTask && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div><strong>Task:</strong> {selectedTask.title}</div>
                  <div><strong>Project:</strong> {selectedTask.project}</div>
                  <div><strong>Location:</strong> {selectedTask.location}</div>
                </div>
              )}

              {/* Work Summary */}
              <div className="space-y-2">
                <Label htmlFor="work-summary">Initial Work Summary *</Label>
                <Textarea
                  id="work-summary"
                  placeholder="Describe the initial work completed, setup done, challenges faced, and any observations..."
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Date of Work */}
              <div className="space-y-2">
                <Label htmlFor="date-of-work">Date of Work *</Label>
                <Input
                  id="date-of-work"
                  type="date"
                  value={dateOfWork}
                  onChange={(e) => setDateOfWork(e.target.value)}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Images (Optional)</Label>
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("start-task-image-upload")?.click()
                    }
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                  <input
                    id="start-task-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Display uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Uploaded Images:</Label>
                      {uploadedImages.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <span className="text-sm truncate">
                            {file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsStartTaskOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Task & Submit Report
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Standalone Report Dialog */}
        <Dialog open={isStandaloneReportOpen} onOpenChange={setIsStandaloneReportOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Submit Report</span>
              </DialogTitle>
              <DialogDescription>
                Submit a work report for your completed or ongoing tasks.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleStandaloneReportSubmit} className="space-y-4">
              {/* Task Title Input */}
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title *</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              {/* Work Summary */}
              <div className="space-y-2">
                <Label htmlFor="standalone-work-summary">Work Summary *</Label>
                <Textarea
                  id="standalone-work-summary"
                  placeholder="Describe the work completed, challenges faced, and any observations..."
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              {/* Date of Work */}
              <div className="space-y-2">
                <Label htmlFor="standalone-date-of-work">Date of Work *</Label>
                <Input
                  id="standalone-date-of-work"
                  type="date"
                  value={dateOfWork}
                  onChange={(e) => setDateOfWork(e.target.value)}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="standalone-images">Images (Optional)</Label>
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("standalone-image-upload")?.click()
                    }
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                  <input
                    id="standalone-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Display uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Uploaded Images:</Label>
                      {uploadedImages.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <span className="text-sm truncate">
                            {file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsStandaloneReportOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Report
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Task Status</DialogTitle>
              <DialogDescription>
                Update the status of "{selectedTask?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="text-sm font-medium">
                  New Status *
                </label>
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
                <Label htmlFor="status-description">Work Progress Description</Label>
                <Textarea
                  id="status-description"
                  placeholder="Describe how much work has been done, any issues, or progress details..."
                  value={statusDescription}
                  onChange={(e) => setStatusDescription(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateStatusOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate}>Update Status</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianTasks;