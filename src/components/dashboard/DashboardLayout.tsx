import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProfilePictureUpload from "@/components/ui/ProfilePictureUpload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/ui/notifications";
import {
  Building2,
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  Shield,
  Wrench,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "superadmin" | "super-admin" | "manager" | "technician";
  userName?: string;
  userEmail?: string;
  userProfilePicture?: string;
  onProfilePictureUpload?: (file: File) => Promise<void>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole,
  userName = "User",
  userEmail = "user@cosmicsolutions.com",
  userProfilePicture,
  onProfilePictureUpload,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [profilePicture, setProfilePicture] = React.useState(userProfilePicture);

  // Use onProfilePictureUpload if provided, otherwise fallback to local upload logic
  const handleProfilePictureUpload = onProfilePictureUpload || (async (file: File) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await fetch("https://cosmicproject-backend-1.onrender.com/api/profile/picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") {
        setProfilePicture(`https://cosmicproject-backend-1.onrender.com/${data.data.profilePicture}`);
      } else {
        throw new Error(data.message || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Profile picture upload error:", error);
      throw error;
    }
  });

  // Normalize role to handle both server formats
  const normalizeRole = (role: string): keyof typeof roleConfig => {
    if (role === "super-admin") return "superadmin";
    return role as keyof typeof roleConfig;
  };

  const roleConfig = {
    superadmin: {
      title: "Super Admin",
      icon: Shield,
      color: "bg-primary text-primary-foreground",
      navigation: [
        { title: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
        {
          title: "Projects",
          href: "/superadmin/projects",
          icon: ClipboardList,
        },
        { title: "Reports", href: "/superadmin/reports", icon: FileText },
        { title: "Settings", href: "/superadmin/settings", icon: Settings },
      ],
    },
    manager: {
      title: "Manager",
      icon: Settings,
      color: "bg-success text-success-foreground",
      navigation: [
        { title: "Dashboard", href: "/manager", icon: LayoutDashboard },
        {
          title: "My Projects",
          href: "/manager/projects",
          icon: ClipboardList,
        },
        { title: "Technicians", href: "/manager/technicians", icon: Users },
        { title: "Tasks", href: "/manager/tasks", icon: FileText },
      ],
    },
    technician: {
      title: "Technician",
      icon: Wrench,
      color: "bg-pending text-pending-foreground",
      navigation: [
        { title: "Dashboard", href: "/technician", icon: LayoutDashboard },
        { title: "My Tasks", href: "/technician/tasks", icon: ClipboardList },
      ],
    },
  };

  const normalizedRole = normalizeRole(userRole);
  const config = roleConfig[normalizedRole];

  // Add error handling for invalid userRole
  if (!config) {
    console.error(
      `Invalid userRole: "${userRole}". Available roles:`,
      Object.keys(roleConfig),
    );
    // Fallback to a default config to prevent crashes
    const defaultConfig = {
      title: "User",
      icon: Shield,
      color: "bg-muted text-muted-foreground",
      navigation: [
        { title: "Dashboard", href: "/login", icon: LayoutDashboard },
      ],
    };
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid User Role</h1>
          <p className="text-muted-foreground mt-2">
            Role: "{userRole}" (type: {typeof userRole})
          </p>
          <p className="text-muted-foreground">
            Available roles: {Object.keys(roleConfig).join(", ")}
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const RoleIcon = config.icon;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Navigate anyway to clear the UI state
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "mobile-sidebar lg:static lg:w-64 lg:transform-none flex flex-col",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mobile-padding border-b border-sidebar-border">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fdf520b57241b409c97fe8b1702f73e79%2Fce826268d92b499a98eeb82a92fb89e5?format=webp&width=800"
            alt="Cosmic Solutions"
            className="h-8 sm:h-10 w-auto max-w-full"
          />
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="mobile-padding border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <ProfilePictureUpload
              currentImage={profilePicture}
              userName={userName}
              onImageUpload={handleProfilePictureUpload}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="mobile-text-sm font-medium text-sidebar-foreground truncate">
                {userName}
              </p>
              <Badge
                variant="outline"
                className={`${config.color} border-0 mobile-text-sm`}
              >
                <RoleIcon className="h-3 w-3 mr-1" />
                {config.title}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mobile-padding mobile-space-y">
          {config.navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mobile-text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false); // Close mobile sidebar
                }}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.title}
              </Button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mobile-padding border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start mobile-text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="mobile-header">
          <div className="flex items-center mobile-space-x">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="mobile-header-title">
              {config.navigation.find((item) => item.href === location.pathname)
                ?.title || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center mobile-space-x">
            {/* Notifications */}
            <NotificationBell className="text-muted-foreground" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative mobile-avatar rounded-full"
                >
                  <Avatar className="mobile-avatar">
                    <AvatarImage src={profilePicture} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="mobile-text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="mobile-text-sm leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/${normalizedRole}/settings`)}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="mobile-content">
          <div
            className="lg:hidden h-0 w-0"
            onClick={() => setSidebarOpen(false)}
          />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
