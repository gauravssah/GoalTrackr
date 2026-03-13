import { BlogEntry, DailySurvey, Goal, JobApplication, ProductivityStats, Task, User } from "@/types";

export const mockUser: User = {
  _id: "u1",
  name: "Gaurav Sah",
  email: "gaurav@example.com",
  bio: "Designing focused days, measurable weeks, and high-impact years.",
  profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  joinedDate: "2026-01-04T00:00:00.000Z",
  productivityScore: 84,
  totalTasksCompleted: 173,
  streakDays: 7
};

export const mockTasks: Task[] = [
  {
    _id: "t1",
    title: "Prepare system design notes",
    description: "Complete distributed systems prep for interview round.",
    priority: "High",
    deadline: "2026-03-14T18:00:00.000Z",
    estimatedTime: 90,
    tags: ["career", "deep-work"],
    status: "In Progress",
    distractionCount: 1,
    notes: "Focus on caching and queues.",
    createdAt: "2026-03-13T06:00:00.000Z",
    timeEntries: []
  },
  {
    _id: "t2",
    title: "Submit GoalTrackr deployment checklist",
    description: "Verify env vars, scripts, and security headers.",
    priority: "Medium",
    deadline: "2026-03-15T10:00:00.000Z",
    estimatedTime: 45,
    tags: ["product", "ops"],
    status: "Pending",
    distractionCount: 0,
    createdAt: "2026-03-13T08:30:00.000Z",
    timeEntries: []
  },
  {
    _id: "t3",
    title: "Reflect on wins and blockers",
    description: "Write end-of-day journal summary.",
    priority: "Low",
    deadline: "2026-03-13T20:00:00.000Z",
    estimatedTime: 20,
    tags: ["journal"],
    status: "Completed",
    satisfactionLevel: 8,
    distractionCount: 2,
    notes: "Strong momentum after lunch.",
    createdAt: "2026-03-13T07:00:00.000Z",
    completedAt: "2026-03-13T18:40:00.000Z",
    timeEntries: []
  }
];

export const mockGoals: Goal[] = [
  { _id: "g1", title: "Daily focus hours", description: "Hit 5 deep work hours.", period: "Daily", targetValue: 5, currentValue: 4, dueDate: "2026-03-13", completed: false },
  { _id: "g2", title: "Weekly interview prep", description: "Finish 12 DSA problems.", period: "Weekly", targetValue: 12, currentValue: 9, dueDate: "2026-03-16", completed: false },
  { _id: "g3", title: "Monthly portfolio refresh", description: "Ship two case studies.", period: "Monthly", targetValue: 2, currentValue: 1, dueDate: "2026-03-31", completed: false },
  { _id: "g4", title: "Yearly career transition", description: "Land product engineering role.", period: "Yearly", targetValue: 1, currentValue: 0, dueDate: "2026-12-31", completed: false }
];

export const mockJobs: JobApplication[] = [
  {
    _id: "j1",
    companyName: "Linear Labs",
    jobRole: "Frontend Engineer",
    jobLink: "https://example.com/linear-labs",
    applicationDate: "2026-03-10",
    status: "Interview",
    followUpReminder: "2026-03-16",
    notes: "Round two focuses on architecture.",
    timelineProgress: 60
  },
  {
    _id: "j2",
    companyName: "NotionWorks",
    jobRole: "Product Engineer",
    jobLink: "https://example.com/notionworks",
    applicationDate: "2026-03-08",
    status: "Applied",
    followUpReminder: "2026-03-18",
    notes: "Portfolio link included.",
    timelineProgress: 25
  }
];

export const mockBlogs: BlogEntry[] = [
  {
    _id: "b1",
    title: "Steadier than motivated",
    content: "Today reminded me that consistency beats hype. The calm blocks mattered most.",
    mood: "Grounded",
    tags: ["reflection", "focus"],
    date: "2026-03-13"
  }
];

export const mockSurveys: DailySurvey[] = [
  {
    _id: "s1",
    productiveRating: 8,
    satisfactionRating: 9,
    biggestDistraction: "Social media",
    learnedToday: "Clearer timeboxing sharpens output.",
    improveTomorrow: "Start deep work before checking messages.",
    date: "2026-03-13"
  }
];

export const mockStats: ProductivityStats = {
  completedToday: 6,
  pendingTasks: 4,
  focusScore: 82,
  distractionsToday: 3,
  weeklyProgress: 74,
  dailyProductivity: [
    { date: "Mon", completed: 3, planned: 5 },
    { date: "Tue", completed: 4, planned: 5 },
    { date: "Wed", completed: 6, planned: 7 },
    { date: "Thu", completed: 5, planned: 6 },
    { date: "Fri", completed: 6, planned: 8 }
  ],
  weeklyProgressChart: [
    { week: "W1", completed: 21 },
    { week: "W2", completed: 26 },
    { week: "W3", completed: 24 },
    { week: "W4", completed: 31 }
  ],
  priorityDistribution: [
    { name: "High", value: 10 },
    { name: "Medium", value: 14 },
    { name: "Low", value: 7 }
  ],
  yearlyTrend: [
    { month: "Jan", productivity: 61 },
    { month: "Feb", productivity: 69 },
    { month: "Mar", productivity: 77 },
    { month: "Apr", productivity: 72 },
    { month: "May", productivity: 80 },
    { month: "Jun", productivity: 82 }
  ],
  satisfactionAnalysis: [
    { label: "Mon", value: 7 },
    { label: "Tue", value: 8 },
    { label: "Wed", value: 8 },
    { label: "Thu", value: 9 },
    { label: "Fri", value: 8 }
  ],
  distractionAnalysis: [
    { name: "Phone", value: 2 },
    { name: "Social media", value: 4 },
    { name: "YouTube", value: 1 },
    { name: "Other", value: 2 }
  ],
  heatmap: Array.from({ length: 28 }, (_, index) => ({
    date: `2026-02-${String(index + 1).padStart(2, "0")}`,
    count: (index * 3) % 6
  }))
};
