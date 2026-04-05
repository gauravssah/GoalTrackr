"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";

const QUESTIONS = [
  "What did I do well today?",
  "What could I improve?",
  "What did I learn today?",
  "Did I manage time properly?",
  "What is tomorrow's focus?",
];

export default function ReflectionPage() {
  const reflections = useAppStore((state) => state.reflections);
  const createReflection = useAppStore((state) => state.createReflection);
  const updateReflection = useAppStore((state) => state.updateReflection);
  const deleteReflection = useAppStore((state) => state.deleteReflection);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [answers, setAnswers] = useState<string[]>(
    Array.from({ length: 5 }, () => ""),
  );

  const history = useMemo(
    () =>
      [...reflections].sort(
        (left, right) =>
          new Date(right.date).getTime() - new Date(left.date).getTime(),
      ),
    [reflections],
  );

  const selectedEntry = useMemo(
    () =>
      reflections.find((entry) => isSameDay(entry.date, selectedDate)) ?? null,
    [reflections, selectedDate],
  );

  useEffect(() => {
    if (!selectedEntry) {
      setAnswers(Array.from({ length: 5 }, () => ""));
      return;
    }

    setAnswers(selectedEntry.answers);
  }, [selectedEntry]);

  async function saveReflection() {
    const payload = {
      date: new Date(selectedDate).toISOString(),
      answers: answers.map((answer) => answer.trim()),
    };

    if (selectedEntry) {
      await updateReflection(selectedEntry._id, payload);
      return;
    }

    await createReflection(payload);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">
              Daily reflection
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              A fixed five-question self-review.
            </h1>
            <p className="max-w-3xl text-sm text-foreground/65">
              Save one reflection per day, revisit it by date, and keep your
              focus on daily improvement.
            </p>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Today&apos;s reflection
                </h2>
                <p className="text-sm text-foreground/60">
                  Answer the same five questions every day.
                </p>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="h-10 rounded-xl border bg-card px-3 text-sm"
              />
            </div>

            {QUESTIONS.map((question, index) => (
              <FieldGroup key={question} label={`${index + 1}. ${question}`}>
                <Textarea
                  value={answers[index] || ""}
                  onChange={(event) => {
                    const next = [...answers];
                    next[index] = event.target.value;
                    setAnswers(next);
                  }}
                  placeholder="Write your answer"
                />
              </FieldGroup>
            ))}

            <Button onClick={saveReflection}>
              {selectedEntry ? "Update reflection" : "Save reflection"}
            </Button>
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Reflection history</h2>
              <p className="text-sm text-foreground/60">
                Review past entries by date.
              </p>
            </div>

            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-foreground/60">
                No reflections saved yet.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry) => (
                  <article
                    key={entry._id}
                    className="rounded-2xl border border-border/70 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Badge>{new Date(entry.date).toLocaleDateString()}</Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDate(entry.date.slice(0, 10));
                            setAnswers(entry.answers);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReflection(entry._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                      {entry.answers.map((answer, index) => (
                        <li key={`${entry._id}-${index}`}>
                          <span className="font-medium">Q{index + 1}:</span>{" "}
                          {answer}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function isSameDay(value: string, selectedDate: string) {
  const left = new Date(value);
  const right = new Date(selectedDate);
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
