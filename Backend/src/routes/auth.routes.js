const express = require("express");
const { signup, login, profile, updateProfile } = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { signupSchema, loginSchema, updateProfileSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/profile", protect, profile);
router.patch("/profile", protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
