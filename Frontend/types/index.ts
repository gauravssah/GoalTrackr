export type Priority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type JobStatus = "Applied" | "Interview" | "Rejected" | "Offer";
export type CompletionStatus =
  | "Completed"
  | "Partially Completed"
  | "Not Completed"
  | "Pending";
export type GoalStatus =
  | "Completed"
  | "Partially Completed"
  | "Not Completed"
  | "Pending";

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
  joinedDate: string;
  productivityScore: number;
  totalTasksCompleted: number;
  streakDays: number;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  slotStartMinutes?: number;
  slotEndMinutes?: number;
  sequence?: number;
  deadline: string;
  estimatedTime: number;
  tags: string[];
  status: TaskStatus;
  completionStatus?: CompletionStatus;
  satisfactionLevel?: number;
  distractionCount: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  actualTimeSpentSeconds?: number;
  timerStatus?: "Idle" | "Running" | "Paused";
  activeSessionStartedAt?: string | null;
  timeEntries: Array<{
    startTime: string;
    endTime: string;
    durationSeconds: number;
  }>;
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  period: "Daily" | "Weekly" | "Monthly" | "Yearly";
  status?: GoalStatus;
  targetValue: number;
  currentValue: number;
  satisfactionScore?: number;
  dueDate: string;
  completed: boolean;
}

export interface JobApplication {
  _id: string;
  companyName: string;
  jobRole: string;
  jobLink: string;
  applicationDate: string;
  status: JobStatus;
  followUpReminder?: string;
  notes?: string;
  timelineProgress: number;
}

export interface JobPortal {
  _id: string;
  portalName: string;
  portalUrl: string;
  portalUserId: string;
  portalPassword: string;
  description?: string;
}

export interface BlogEntry {
  _id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  date: string;
}

export interface DailySurvey {
  _id: string;
  productiveRating: number;
  satisfactionRating: number;
  biggestDistraction: string;
  learnedToday: string;
  improveTomorrow: string;
  date: string;
}

export interface Reflection {
  _id: string;
  date: string;
  answers: string[];
}

export interface ProductivityStats {
  completedToday: number;
  pendingTasks: number;
  focusScore: number;
  distractionsToday: number;
  weeklyProgress: number;
  dailyProductivity: Array<{
    date: string;
    completed: number;
    planned: number;
  }>;
  weeklyProgressChart: Array<{ week: string; completed: number }>;
  priorityDistribution: Array<{ name: string; value: number }>;
  yearlyTrend: Array<{ month: string; productivity: number }>;
  satisfactionAnalysis: Array<{ label: string; value: number }>;
  distractionAnalysis: Array<{ name: string; value: number }>;
  heatmap: Array<{ date: string; count: number }>;
}
