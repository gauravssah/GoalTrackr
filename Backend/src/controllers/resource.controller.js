const NodeCache = require("node-cache");
const Task = require("../models/task.model");
const Goal = require("../models/goal.model");
const JobApplication = require("../models/job-application.model");
const Blog = require("../models/blog.model");
const DailySurvey = require("../models/daily-survey.model");
const ProductivityStats = require("../models/productivity-stats.model");
const catchAsync = require("../utils/catch-async");
const { buildQuery } = require("../utils/api-features");
const { getDashboardAnalytics } = require("../services/analytics.service");

const cache = new NodeCache({ stdTTL: 60 });

function clearUserResourceCache(resourceName, userId) {
  const prefix = `${resourceName}-${userId}`;
  const matchingKeys = cache.keys().filter((key) => key.startsWith(prefix));
  if (matchingKeys.length) {
    cache.del(matchingKeys);
  }
}

function createCrudController(Model, resourceName) {
  return {
    create: catchAsync(async (req, res) => {
      const doc = await Model.create({ ...req.body, user: req.user._id });
      clearUserResourceCache(resourceName, req.user._id);
      res.status(201).json({ success: true, data: doc });
    }),
    list: catchAsync(async (req, res) => {
      const cacheKey = `${resourceName}-${req.user._id}-${JSON.stringify(req.query)}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, cached: true, ...cached });
      }

      const filter = { user: req.user._id };
      if (req.query.status) filter.status = req.query.status;
      if (req.query.priority) filter.priority = req.query.priority;
      if (req.query.tags) filter.tags = { $in: String(req.query.tags).split(",") };
      if (req.query.q) filter.$or = [{ title: { $regex: req.query.q, $options: "i" } }, { notes: { $regex: req.query.q, $options: "i" } }];

      const docs = await buildQuery(Model.find(filter), req.query);
      const response = { success: true, count: docs.length, data: docs };
      cache.set(cacheKey, response);
      return res.json(response);
    }),
    update: catchAsync(async (req, res) => {
      const doc = await Model.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
        new: true,
        runValidators: true
      });
      clearUserResourceCache(resourceName, req.user._id);
      res.json({ success: true, data: doc });
    }),
    remove: catchAsync(async (req, res) => {
      await Model.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      clearUserResourceCache(resourceName, req.user._id);
      res.status(204).send();
    })
  };
}

const taskCrud = createCrudController(Task, "tasks");
const goalCrud = createCrudController(Goal, "goals");
const jobCrud = createCrudController(JobApplication, "jobs");
const blogCrud = createCrudController(Blog, "blogs");
const surveyCrud = createCrudController(DailySurvey, "surveys");

exports.createTask = taskCrud.create;
exports.listTasks = taskCrud.list;
exports.updateTask = taskCrud.update;
exports.deleteTask = taskCrud.remove;

exports.createGoal = goalCrud.create;
exports.listGoals = goalCrud.list;
exports.updateGoal = goalCrud.update;
exports.deleteGoal = goalCrud.remove;

exports.createJob = jobCrud.create;
exports.listJobs = jobCrud.list;
exports.updateJob = jobCrud.update;
exports.deleteJob = jobCrud.remove;

exports.createBlog = blogCrud.create;
exports.listBlogs = blogCrud.list;
exports.updateBlog = blogCrud.update;
exports.deleteBlog = blogCrud.remove;

exports.createSurvey = surveyCrud.create;
exports.listSurveys = surveyCrud.list;
exports.updateSurvey = surveyCrud.update;
exports.deleteSurvey = surveyCrud.remove;

exports.getStats = catchAsync(async (req, res) => {
  const analytics = await getDashboardAnalytics(req.user._id);
  const stats = await ProductivityStats.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      completedTasksToday: analytics.completedToday,
      pendingTasks: analytics.pendingTasks,
      focusScore: analytics.focusScore,
      distractionsToday: analytics.distractionsToday,
      weeklyProgress: analytics.weeklyProgress,
      yearlyAchievementScore: analytics.yearlyAchievementScore
    },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: {
      ...stats.toObject(),
      satisfactionAverage: analytics.satisfactionAverage
    }
  });
});

exports.globalSearch = catchAsync(async (req, res) => {
  const query = req.query.q || "";
  const regex = new RegExp(query, "i");

  const [tasks, blogs, jobs] = await Promise.all([
    Task.find({ user: req.user._id, $or: [{ title: regex }, { description: regex }, { tags: regex }] }).limit(8),
    Blog.find({ user: req.user._id, $or: [{ title: regex }, { content: regex }, { tags: regex }] }).limit(8),
    JobApplication.find({ user: req.user._id, $or: [{ companyName: regex }, { jobRole: regex }, { notes: regex }] }).limit(8)
  ]);

  res.json({
    success: true,
    data: { tasks, blogs, jobs }
  });
});
