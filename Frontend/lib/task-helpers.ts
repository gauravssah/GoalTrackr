import { Task } from "@/types";

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getLiveElapsed(task: Task, tick: number) {
  if (task.timerStatus !== "Running" || !task.activeSessionStartedAt) {
    return task.actualTimeSpentSeconds || 0;
  }

  const started = new Date(task.activeSessionStartedAt).getTime();
  const extra = Math.max(0, Math.floor((tick - started) / 1000));
  return (task.actualTimeSpentSeconds || 0) + extra;
}

export function isSameDay(dateValue?: string, baseDate = new Date()) {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  return (
    date.getFullYear() === baseDate.getFullYear() &&
    date.getMonth() === baseDate.getMonth() &&
    date.getDate() === baseDate.getDate()
  );
}

export function isYesterday(dateValue?: string) {
  if (!dateValue) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(dateValue, yesterday);
}

export function getTaskSequence(task: Task) {
  return typeof task.sequence === "number" ? task.sequence : Number.MAX_SAFE_INTEGER;
}

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    const statusOrder = { "In Progress": 0, Pending: 1, Completed: 2 } as const;
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
    const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
    if (aDeadline !== bDeadline) return aDeadline - bDeadline;

    const sequenceDiff = getTaskSequence(a) - getTaskSequence(b);
    if (sequenceDiff !== 0) return sequenceDiff;

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}
