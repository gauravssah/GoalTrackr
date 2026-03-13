const { z } = require("zod");

const objectIdParam = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1)
  })
});

const taskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(["High", "Medium", "Low"]).optional(),
    sequence: z.number().min(0).optional(),
    deadline: z.string().optional(),
    estimatedTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
    satisfactionLevel: z.number().min(1).max(10).optional(),
    distractionCount: z.number().min(0).optional(),
    notes: z.string().optional(),
    actualTimeSpentSeconds: z.number().min(0).optional(),
    timerStatus: z.enum(["Idle", "Running", "Paused"]).optional(),
    activeSessionStartedAt: z.string().nullable().optional(),
    timeEntries: z.array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
        durationSeconds: z.number().min(0)
      })
    ).optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const goalSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    period: z.enum(["Daily", "Weekly", "Monthly", "Yearly"]),
    targetValue: z.number().positive(),
    currentValue: z.number().min(0).optional(),
    dueDate: z.string().optional(),
    completed: z.boolean().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const jobSchema = z.object({
  body: z.object({
    companyName: z.string().min(1),
    jobRole: z.string().min(1),
    jobLink: z.string().url().optional(),
    applicationDate: z.string(),
    status: z.enum(["Applied", "Interview", "Rejected", "Offer"]).optional(),
    followUpReminder: z.string().optional(),
    notes: z.string().optional(),
    timelineProgress: z.number().min(0).max(100).optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const blogSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    mood: z.string().min(1),
    tags: z.array(z.string()).optional(),
    date: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const surveySchema = z.object({
  body: z.object({
    productiveRating: z.number().min(1).max(10),
    satisfactionRating: z.number().min(1).max(10),
    biggestDistraction: z.string().min(1),
    learnedToday: z.string().min(1),
    improveTomorrow: z.string().min(1),
    date: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

module.exports = {
  objectIdParam,
  taskSchema,
  goalSchema,
  jobSchema,
  blogSchema,
  surveySchema
};
