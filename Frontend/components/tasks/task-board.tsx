"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock3, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export function TaskBoard() {
  const tasks = useAppStore((state) => state.tasks);

  return (
    <div className="space-y-5">
      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-foreground/40" />
            <Input className="pl-10" placeholder="Search tasks by title, tag, or notes" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <Button>Create task</Button>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div key={task._id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="h-full">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="mt-1 text-sm text-foreground/65">{task.description}</p>
                  </div>
                  <Badge className={task.priority === "High" ? "bg-secondary/15 text-secondary" : ""}>{task.priority}</Badge>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    Deadline: {formatDate(task.deadline)}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Status: {task.status}
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button size="sm">Mark completed</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
