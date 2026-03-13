const { z } = require("zod");

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    profileImage: z.string().url().optional(),
    bio: z.string().max(240).optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    bio: z.string().max(240).optional(),
    profileImage: z.string().url().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

module.exports = { signupSchema, loginSchema, updateProfileSchema };
