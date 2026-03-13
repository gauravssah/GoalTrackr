"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";
import { formatDate } from "@/lib/utils";

export default function JournalPage() {
  const blogs = useAppStore((state) => state.blogs);
  const surveys = useAppStore((state) => state.surveys);
  const createBlog = useAppStore((state) => state.createBlog);
  const deleteBlog = useAppStore((state) => state.deleteBlog);
  const createSurvey = useAppStore((state) => state.createSurvey);

  const [blog, setBlog] = useState({ title: "", content: "", mood: "", tags: "" });
  const [survey, setSurvey] = useState({
    productiveRating: 7,
    satisfactionRating: 7,
    biggestDistraction: "",
    learnedToday: "",
    improveTomorrow: ""
  });

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Daily blog / journal</h1>
              <p className="text-sm text-foreground/60">Write section yahin rakha gaya hai, aur entries me date clearly show hogi.</p>
            </div>
            <Badge>{formatDate(new Date())}</Badge>
          </div>
          <FieldGroup label="Journal title">
            <Input placeholder="Title" value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Mood">
            <Input placeholder="Mood" value={blog.mood} onChange={(e) => setBlog({ ...blog, mood: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Tags" hint="Comma separated labels like focus, career.">
            <Input placeholder="Tags: focus, career" value={blog.tags} onChange={(e) => setBlog({ ...blog, tags: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Reflection">
            <Textarea placeholder="Write your reflection" value={blog.content} onChange={(e) => setBlog({ ...blog, content: e.target.value })} />
          </FieldGroup>
          <Button onClick={async () => {
            await createBlog({ ...blog, tags: blog.tags.split(",").map((tag) => tag.trim()).filter(Boolean), date: new Date().toISOString() });
            setBlog({ title: "", content: "", mood: "", tags: "" });
          }}>Save journal</Button>

          <div className="space-y-3">
            {blogs.map((entry) => (
              <div key={entry._id} className="rounded-2xl border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{entry.title}</h2>
                    <p className="mt-1 text-xs text-foreground/55">{formatDate(entry.date)}</p>
                  </div>
                  <Badge>{entry.mood}</Badge>
                </div>
                <p className="text-sm text-foreground/70">{entry.content}</p>
                <Button className="mt-3" variant="outline" size="sm" onClick={() => deleteBlog(entry._id)}>Delete</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">End of day productivity survey</h1>
              <p className="text-sm text-foreground/60">Survey cards me ab date bhi show hogi taaki day identify karna easy ho.</p>
            </div>
            <Badge>{formatDate(new Date())}</Badge>
          </div>
          <FieldGroup label="Productivity rating" hint="Give your day a score from 1 to 10.">
            <Input type="number" min={1} max={10} value={survey.productiveRating} onChange={(e) => setSurvey({ ...survey, productiveRating: Number(e.target.value) })} placeholder="How productive was your day?" />
          </FieldGroup>
          <FieldGroup label="Satisfaction rating" hint="How satisfied are you with today's outcome?">
            <Input type="number" min={1} max={10} value={survey.satisfactionRating} onChange={(e) => setSurvey({ ...survey, satisfactionRating: Number(e.target.value) })} placeholder="How satisfied are you?" />
          </FieldGroup>
          <FieldGroup label="Biggest distraction">
            <Input placeholder="Biggest distraction" value={survey.biggestDistraction} onChange={(e) => setSurvey({ ...survey, biggestDistraction: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="What did you learn today?">
            <Textarea placeholder="What did you learn today?" value={survey.learnedToday} onChange={(e) => setSurvey({ ...survey, learnedToday: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="What will you improve tomorrow?">
            <Textarea placeholder="What will you improve tomorrow?" value={survey.improveTomorrow} onChange={(e) => setSurvey({ ...survey, improveTomorrow: e.target.value })} />
          </FieldGroup>
          <Button onClick={async () => {
            await createSurvey({ ...survey, date: new Date().toISOString() });
            setSurvey({ productiveRating: 7, satisfactionRating: 7, biggestDistraction: "", learnedToday: "", improveTomorrow: "" });
          }}>Save survey</Button>

          <div className="space-y-3">
            {surveys.map((entry) => (
              <div key={entry._id} className="rounded-2xl border border-border p-4 text-sm">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-foreground/45">{formatDate(entry.date)}</p>
                <p>Productive: {entry.productiveRating}/10</p>
                <p>Satisfied: {entry.satisfactionRating}/10</p>
                <p>Distraction: {entry.biggestDistraction}</p>
                <p className="mt-2 text-foreground/70">Learned: {entry.learnedToday}</p>
                <p className="text-foreground/70">Tomorrow: {entry.improveTomorrow}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
