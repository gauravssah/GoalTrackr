import { AppShell } from "@/components/layout/app-shell";
import { TaskFormPanel } from "@/components/tasks/task-form-panel";

export default function CreateTaskPage() {
  return (
    <AppShell>
      <TaskFormPanel />
    </AppShell>
  );
}
