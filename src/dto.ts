import * as v from "valibot";

export const loginUserBodySchema = v.object({
  username: v.pipe(v.string(), v.minLength(1), v.maxLength(16)),
  password: v.pipe(v.string(), v.minLength(1), v.maxLength(18)),
});

export const createOperatorBodySchema = v.object({
  username: v.pipe(v.string(), v.minLength(1), v.maxLength(16)),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(64)),
});

export const updateOperatorBodySchema = v.object({
  username: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(16))),
  name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(64))),
});

export const createIssueBodySchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(64)),
  description: v.pipe(v.string(), v.minLength(1), v.maxLength(500)),
  priority: v.picklist(["low", "medium", "high"]),
});

export const updateIssueStatusBodySchema = v.object({
  status: v.optional(v.picklist(["pending", "in_progress", "completed", "postponed"])),
});

export const findIssueQuerySchema = v.object({
  title: v.optional(v.pipe(v.string(), v.maxLength(64))),
  description: v.optional(v.pipe(v.string(), v.maxLength(100))),
  status: v.optional(v.picklist(["pending", "in_progress", "completed", "postponed"])),
  priority: v.optional(v.picklist(["low", "medium", "high"])),
  createdAtFrom: v.optional(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
  createdAtTo: v.optional(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
  limit: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^\d+$/),
      v.transform(Number),
      v.integer(),
      v.minValue(1),
      v.maxValue(100),
    ),
    "50",
  ),
  offset: v.optional(
    v.pipe(v.string(), v.regex(/^\d+$/), v.transform(Number), v.integer(), v.minValue(0)),
    "0",
  ),
});
