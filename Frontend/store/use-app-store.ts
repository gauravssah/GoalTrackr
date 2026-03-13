"use client";

import { create } from "zustand";
import type { AxiosResponse } from "axios";
import api from "@/lib/api";
import { BlogEntry, DailySurvey, Goal, JobApplication, Task, User } from "@/types";
import { useToastStore } from "@/store/use-toast-store";

type SearchResults = {
  tasks: Task[];
  blogs: BlogEntry[];
  jobs: JobApplication[];
};

interface AuthPayload {
  name?: string;
  email: string;
  password: string;
  bio?: string;
  profileImage?: string;
}

interface ProfilePayload {
  name: string;
  bio?: string;
  profileImage?: string;
}

interface AppState {
  user: User | null;
  tasks: Task[];
  goals: Goal[];
  jobs: JobApplication[];
  blogs: BlogEntry[];
  surveys: DailySurvey[];
  token: string | null;
  loading: boolean;
  bootstrapped: boolean;
  error: string | null;
  searchResults: SearchResults;
  initializeApp: () => Promise<void>;
  login: (payload: AuthPayload) => Promise<boolean>;
  signup: (payload: AuthPayload) => Promise<boolean>;
  logout: () => void;
  fetchAllData: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: ProfilePayload) => Promise<void>;
  createTask: (payload: Partial<Task>) => Promise<void>;
  updateTask: (id: string, payload: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createGoal: (payload: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, payload: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  createJob: (payload: Partial<JobApplication>) => Promise<void>;
  updateJob: (id: string, payload: Partial<JobApplication>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  createBlog: (payload: Partial<BlogEntry>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  createSurvey: (payload: Partial<DailySurvey>) => Promise<void>;
  searchAll: (query: string) => Promise<void>;
  clearError: () => void;
}

const setStoredToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("goaltrackr_token", token);
  } else {
    localStorage.removeItem("goaltrackr_token");
  }
};

const cleanPayload = <T extends object>(payload: T) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined)) as Partial<T>;

async function safeRequest<T = any>(request: Promise<AxiosResponse<T>>) {
  const response = await request;
  return response.data;
}

function notify(title: string, tone: "success" | "error" | "info", description?: string) {
  useToastStore.getState().pushToast({ title, tone, description });
}

function upsertById<T extends { _id: string }>(items: T[], item: T) {
  const existingIndex = items.findIndex((entry) => entry._id === item._id);
  if (existingIndex === -1) {
    return [item, ...items];
  }

  return items.map((entry) => (entry._id === item._id ? item : entry));
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  tasks: [],
  goals: [],
  jobs: [],
  blogs: [],
  surveys: [],
  token: null,
  loading: false,
  bootstrapped: false,
  error: null,
  searchResults: {
    tasks: [],
    blogs: [],
    jobs: []
  },
  clearError: () => set({ error: null }),
  initializeApp: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("goaltrackr_token") : null;
    if (!token) {
      set({ bootstrapped: true, token: null, user: null });
      return;
    }

    set({ token, loading: true, error: null });

    try {
      await get().fetchProfile();
      await get().fetchAllData();
    } catch (error) {
      setStoredToken(null);
      set({ token: null, user: null, error: "Session expired. Please login again." });
      notify("Session expired", "error", "Please login again to continue.");
    } finally {
      set({ loading: false, bootstrapped: true });
    }
  },
  fetchProfile: async () => {
    const response = await safeRequest(api.get("/auth/profile"));
    set({ user: response.data.user });
  },
  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const [tasksRes, goalsRes, jobsRes, blogsRes, surveysRes] = await Promise.all([
        safeRequest(api.get("/tasks?limit=100")),
        safeRequest(api.get("/goals?limit=100")),
        safeRequest(api.get("/jobs?limit=100")),
        safeRequest(api.get("/blogs?limit=100")),
        safeRequest(api.get("/surveys?limit=100"))
      ]);

      set({
        tasks: tasksRes.data,
        goals: goalsRes.data,
        jobs: jobsRes.data,
        blogs: blogsRes.data,
        surveys: surveysRes.data
      });
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : "Failed to load data." });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await safeRequest(api.post("/auth/login", payload));
      setStoredToken(response.token);
      set({ token: response.token, user: response.data.user });
      await get().fetchAllData();
      notify("Login successful", "success", "Your workspace is ready.");
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed.";
      set({ error: message });
      notify("Login failed", "error", message);
      return false;
    } finally {
      set({ loading: false, bootstrapped: true });
    }
  },
  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await safeRequest(api.post("/auth/signup", payload));
      setStoredToken(response.token);
      set({ token: response.token, user: response.data.user });
      await get().fetchAllData();
      notify("Account created", "success", "Welcome to GoalTrackr.");
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Signup failed.";
      set({ error: message });
      notify("Signup failed", "error", message);
      return false;
    } finally {
      set({ loading: false, bootstrapped: true });
    }
  },
  logout: () => {
    setStoredToken(null);
    set({
      user: null,
      token: null,
      tasks: [],
      goals: [],
      jobs: [],
      blogs: [],
      surveys: [],
      bootstrapped: true
    });
    notify("Logged out", "info", "See you next time.");
  },
  updateProfile: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await safeRequest(api.patch("/auth/profile", cleanPayload(payload)));
      set({ user: response.data.user });
      notify("Profile updated", "success", "Your latest profile changes were saved.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Profile update failed.";
      set({ error: message });
      notify("Profile update failed", "error", message);
    } finally {
      set({ loading: false });
    }
  },
  createTask: async (payload) => {
    const response = await safeRequest(api.post("/tasks", cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ tasks: upsertById(state.tasks, response.data) }));
    notify("Task created", "success", "Your new task was saved.");
  },
  updateTask: async (id, payload) => {
    const response = await safeRequest(api.patch(`/tasks/${id}`, cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ tasks: upsertById(state.tasks, response.data) }));
    notify("Task updated", "success", "Task changes saved successfully.");
  },
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set((state) => ({ tasks: state.tasks.filter((task) => task._id !== id) }));
    notify("Task deleted", "info", "The task was removed.");
  },
  createGoal: async (payload) => {
    const response = await safeRequest(api.post("/goals", cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ goals: upsertById(state.goals, response.data) }));
    notify("Plan created", "success", "Your planning block was saved.");
  },
  updateGoal: async (id, payload) => {
    const response = await safeRequest(api.patch(`/goals/${id}`, cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ goals: upsertById(state.goals, response.data) }));
    notify("Plan updated", "success", "Progress was updated.");
  },
  deleteGoal: async (id) => {
    await api.delete(`/goals/${id}`);
    set((state) => ({ goals: state.goals.filter((goal) => goal._id !== id) }));
    notify("Plan deleted", "info", "The plan was removed.");
  },
  createJob: async (payload) => {
    const response = await safeRequest(api.post("/jobs", cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ jobs: upsertById(state.jobs, response.data) }));
    notify("Application saved", "success", "Job application added.");
  },
  updateJob: async (id, payload) => {
    const response = await safeRequest(api.patch(`/jobs/${id}`, cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ jobs: upsertById(state.jobs, response.data) }));
    notify("Application updated", "success", "Job application updated.");
  },
  deleteJob: async (id) => {
    await api.delete(`/jobs/${id}`);
    set((state) => ({ jobs: state.jobs.filter((job) => job._id !== id) }));
    notify("Application deleted", "info", "Job application removed.");
  },
  createBlog: async (payload) => {
    const response = await safeRequest(api.post("/blogs", cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ blogs: upsertById(state.blogs, response.data) }));
    notify("Journal saved", "success", "Reflection added to your timeline.");
  },
  deleteBlog: async (id) => {
    await api.delete(`/blogs/${id}`);
    set((state) => ({ blogs: state.blogs.filter((blog) => blog._id !== id) }));
    notify("Journal deleted", "info", "Entry removed.");
  },
  createSurvey: async (payload) => {
    const response = await safeRequest(api.post("/surveys", cleanPayload(payload as Record<string, unknown>)));
    set((state) => ({ surveys: upsertById(state.surveys, response.data) }));
    notify("Survey saved", "success", "Your day review has been stored.");
  },
  searchAll: async (query) => {
    if (!query.trim()) {
      set({ searchResults: { tasks: [], blogs: [], jobs: [] } });
      return;
    }
    const response = await safeRequest(api.get(`/search?q=${encodeURIComponent(query)}`));
    set({ searchResults: response.data });
  }
}));
