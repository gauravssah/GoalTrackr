import {
  BarChart3,
  BriefcaseBusiness,
  History,
  LayoutDashboard,
  NotebookPen,
  Search,
  Target,
  Trophy,
  UserCircle2,
  Globe,
} from "lucide-react";

export const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Dash",
    icon: LayoutDashboard,
  },
  { href: "/tasks", label: "Create Task", shortLabel: "Create", icon: Target },
  {
    href: "/tasks/today",
    label: "Today Task",
    shortLabel: "Today",
    icon: BarChart3,
  },
  { href: "/goals", label: "Goals", shortLabel: "Goals", icon: Trophy },
  { href: "/jobs", label: "Jobs", shortLabel: "Jobs", icon: BriefcaseBusiness },
  {
    href: "/job-portals",
    label: "Portals",
    shortLabel: "Portals",
    icon: Globe,
  },
  {
    href: "/journal",
    label: "Journal",
    shortLabel: "Journal",
    icon: NotebookPen,
  },
  {
    href: "/reflection",
    label: "Reflection",
    shortLabel: "Reflect",
    icon: BarChart3,
  },
  { href: "/search", label: "Search", shortLabel: "Search", icon: Search },
  {
    href: "/profile",
    label: "Profile",
    shortLabel: "Profile",
    icon: UserCircle2,
  },
  {
    href: "/tasks/history",
    label: "Task History",
    shortLabel: "History",
    icon: History,
  },
];
