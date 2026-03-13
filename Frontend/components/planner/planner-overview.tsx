"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { percentage } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export function PlannerOverview() {
  const goals = useAppStore((state) => state.goals);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {goals.map((goal) => {
        const completion = (goal.currentValue / goal.targetValue) * 100;
        return (
          <Card key={goal._id}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-foreground/45">{goal.period}</p>
                <h3 className="mt-2 text-xl font-semibold">{goal.title}</h3>
              </div>
              <span className="text-sm font-medium text-primary">{percentage(completion)}</span>
            </div>
            <p className="mb-4 text-sm text-foreground/65">{goal.description}</p>
            <Progress value={completion} />
            <p className="mt-3 text-sm text-foreground/60">
              {goal.currentValue} / {goal.targetValue} complete
            </p>
          </Card>
        );
      })}
    </div>
  );
}
