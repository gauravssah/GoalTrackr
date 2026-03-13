import { BarChart3, BriefcaseBusiness, CalendarClock, LayoutDashboard, NotebookPen, PenSquare, Search, Target, UserCircle2 } from "lucide-react";

export const navigationItems = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Dash", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", shortLabel: "Tasks", icon: Target },
  { href: "/tasks/today", label: "Today Tasks", shortLabel: "Today", icon: BarChart3 },
  { href: "/tasks/create", label: "Create Task", shortLabel: "Create", icon: PenSquare },
  { href: "/planner", label: "Planner", shortLabel: "Plan", icon: CalendarClock },
  { href: "/jobs", label: "Jobs", shortLabel: "Jobs", icon: BriefcaseBusiness },
  { href: "/journal", label: "Journal", shortLabel: "Journal", icon: NotebookPen },
  { href: "/search", label: "Search", shortLabel: "Search", icon: Search },
  { href: "/profile", label: "Profile", shortLabel: "Profile", icon: UserCircle2 }
];
