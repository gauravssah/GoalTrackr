import type { Priority, Task } from "@/types";

export type DailySlot = {
  index: number;
  startMinutes: number;
  endMinutes: number;
  label: string;
};

const DAY_END_MINUTES = 23 * 60 + 59;

export function buildDailySlots(intervalMinutes = 30) {
  const slots: DailySlot[] = [];

  for (
    let startMinutes = 0;
    startMinutes < 24 * 60;
    startMinutes += intervalMinutes
  ) {
    const endMinutes = Math.min(
      startMinutes + intervalMinutes,
      DAY_END_MINUTES,
    );
    slots.push({
      index: slots.length,
      startMinutes,
      endMinutes,
      label: `${formatClock(startMinutes)} - ${formatClock(endMinutes)}`,
    });
  }

  return slots;
}

export function formatClock(totalMinutes: number) {
  const normalizedMinutes = Math.max(
    0,
    Math.min(totalMinutes, DAY_END_MINUTES),
  );
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

export function groupContinuousIndices(indices: number[]) {
  if (!indices.length) return [] as Array<{ start: number; end: number }>;

  const sorted = [...indices].sort((left, right) => left - right);
  const groups: Array<{ start: number; end: number }> = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }

    groups.push({ start, end: previous });
    start = current;
    previous = current;
  }

  groups.push({ start, end: previous });
  return groups;
}

export function slotMinutesToIso(dateString: string, minutes: number) {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  date.setMinutes(minutes);
  return date.toISOString();
}

export function getTaskSlotCoverage(task: Task, slots: DailySlot[]) {
  if (!task.scheduledDate) return [] as number[];
  if (
    typeof task.slotStartMinutes !== "number" ||
    typeof task.slotEndMinutes !== "number"
  )
    return [] as number[];

  return slots
    .filter(
      (slot) =>
        slot.startMinutes >= task.slotStartMinutes! &&
        slot.startMinutes < task.slotEndMinutes!,
    )
    .map((slot) => slot.index);
}

export function getTaskCompletionColor(priority: Priority) {
  if (priority === "High")
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200";
  if (priority === "Medium")
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200";
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200";
}
