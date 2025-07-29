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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
  Upload,
  CheckCircle,
  Calendar,
  Eye,
  Trash2,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  project: string;
  status: "assigned" | "in_progress" | "completed" | "delayed";
}

interface Report {
  id: string;
  taskTitle: string;
  workSummary: string;
  dateOfWork: string;
  images: File[];
  submittedAt: string;
  status: "submitted" | "approved" | "rejected";
}

const TechnicianReports = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [dateOfWork, setDateOfWork] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [submittedReports, setSubmittedReports] = useState<Report[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!taskTitle || !workSummary || !dateOfWork) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new report
    const newReport: Report = {
      id: Date.now().toString(),
      taskTitle,
      workSummary,
      dateOfWork,
      images: uploadedImages,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    };

    // In a real app, this would be sent to the backend
    try {
      // Simulate API call
      console.log("Submitting report to backend:", newReport);

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
          `Your report has been sent to the project manager for review.`,
      );
    } catch (error) {
      alert("Failed to submit report. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500 text-white";
      case "approved":
        return "bg-success text-success-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Reports
            </h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              Submit work reports and track your submissions.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Report Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Submit Report</span>
              </CardTitle>
              <CardDescription>
                Submit a work report for your completed or ongoing tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReport} className="space-y-4">
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
                  <Label htmlFor="work-summary">Work Summary *</Label>
                  <Textarea
                    id="work-summary"
                    placeholder="Describe the work completed, challenges faced, and any observations..."
                    value={workSummary}
                    onChange={(e) => setWorkSummary(e.target.value)}
                    rows={5}
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
                        document.getElementById("image-upload")?.click()
                      }
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </Button>
                    <input
                      id="image-upload"
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
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
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
                <Button type="submit" className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Submitted Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Reports</CardTitle>
              <CardDescription>
                Track your previously submitted reports and their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submittedReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No reports submitted
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Your submitted reports will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submittedReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{report.taskTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            Work Date: {formatDate(report.dateOfWork)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(report.status)}
                        >
                          {report.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {report.workSummary}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Submitted: {formatDateTime(report.submittedAt)}
                        </span>
                        <span>{report.images.length} image(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions Table */}
        {submittedReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Detailed view of your recent report submissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Title</TableHead>
                      <TableHead>Work Date</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Images</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submittedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="font-medium">{report.taskTitle}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(report.dateOfWork)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDateTime(report.submittedAt)}
                        </TableCell>
                        <TableCell>{report.images.length} file(s)</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(report.status)}
                          >
                            {report.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              alert(
                                `Report Details:\n\n` +
                                  `Task: ${report.taskTitle}\n` +
                                  `Work Date: ${formatDate(report.dateOfWork)}\n` +
                                  `Summary: ${report.workSummary}\n` +
                                  `Images: ${report.images.length} file(s)\n` +
                                  `Status: ${report.status.toUpperCase()}`,
                              );
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TechnicianReports;