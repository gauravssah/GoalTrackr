const express = require("express");
const controller = require("../controllers/resource.controller");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { objectIdParam, taskSchema, goalSchema, jobSchema, blogSchema, surveySchema, reflectionSchema } = require("../validators/resource.validator");

const router = express.Router();

router.use(protect);

router.get("/tasks", controller.listTasks);
router.post("/tasks", validate(taskSchema), controller.createTask);
router.patch("/tasks/:id", validate(objectIdParam), controller.updateTask);
router.delete("/tasks/:id", validate(objectIdParam), controller.deleteTask);

router.get("/goals", controller.listGoals);
router.post("/goals", validate(goalSchema), controller.createGoal);
router.patch("/goals/:id", validate(objectIdParam), controller.updateGoal);
router.delete("/goals/:id", validate(objectIdParam), controller.deleteGoal);

router.get("/jobs", controller.listJobs);
router.post("/jobs", validate(jobSchema), controller.createJob);
router.patch("/jobs/:id", validate(objectIdParam), controller.updateJob);
router.delete("/jobs/:id", validate(objectIdParam), controller.deleteJob);

router.get("/blogs", controller.listBlogs);
router.post("/blogs", validate(blogSchema), controller.createBlog);
router.patch("/blogs/:id", validate(objectIdParam), controller.updateBlog);
router.delete("/blogs/:id", validate(objectIdParam), controller.deleteBlog);

router.get("/surveys", controller.listSurveys);
router.post("/surveys", validate(surveySchema), controller.createSurvey);
router.patch("/surveys/:id", validate(objectIdParam), controller.updateSurvey);
router.delete("/surveys/:id", validate(objectIdParam), controller.deleteSurvey);

router.get("/reflections", controller.listReflections);
router.post("/reflections", validate(reflectionSchema), controller.createReflection);
router.patch("/reflections/:id", validate(objectIdParam), controller.updateReflection);
router.delete("/reflections/:id", validate(objectIdParam), controller.deleteReflection);

router.get("/stats", controller.getStats);
router.get("/search", controller.globalSearch);

module.exports = router;
