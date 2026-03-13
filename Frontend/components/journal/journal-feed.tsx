"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/use-app-store";
import { formatDate } from "@/lib/utils";

export function JournalFeed() {
  const blogs = useAppStore((state) => state.blogs);
  const surveys = useAppStore((state) => state.surveys);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Daily reflections</h3>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="rounded-2xl border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{blog.title}</h4>
                  <p className="text-xs text-foreground/55">{formatDate(blog.date)}</p>
                </div>
                <Badge>{blog.mood}</Badge>
              </div>
              <p className="text-sm text-foreground/70">{blog.content}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold">End-of-day survey</h3>
        <div className="space-y-3 text-sm">
          <p>Date: {surveys[0]?.date ? formatDate(surveys[0].date) : "N/A"}</p>
          <p>Latest rating: {surveys[0]?.productiveRating}/10 productive, {surveys[0]?.satisfactionRating}/10 satisfied.</p>
          <p>Biggest distraction: {surveys[0]?.biggestDistraction}</p>
          <Textarea placeholder="What will you improve tomorrow?" />
          <Button>Save survey</Button>
        </div>
      </Card>
    </div>
  );
}
