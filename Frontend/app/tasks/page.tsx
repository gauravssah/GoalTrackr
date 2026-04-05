import { AppShell } from "@/components/layout/app-shell";
import { SmartScheduler } from "@/components/tasks/smart-scheduler";

export default function TasksPage() {
  return (
    <AppShell>
      <SmartScheduler />
    </AppShell>
  );
}
