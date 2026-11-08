import * as v from "valibot";
import { createMiddleware } from "hono/factory";
import { ValidationError } from "@utils/main-error";
import { responseMessage } from "@utils/response-message";

type ValidatorTarget = "json" | "query" | "param" | "form";

export function myValidator<TSchema extends v.GenericSchema, TTarget extends ValidatorTarget>(
  schema: TSchema,
  target: TTarget,
) {
  return createMiddleware<{
    Variables: {
      [K in TTarget]: v.InferOutput<TSchema>;
    };
  }>(async (c, next) => {
    let data: unknown;

    switch (target) {
      case "form":
        data = Object.fromEntries((await c.req.formData()).entries());
        break;

      case "json":
        data = await c.req.json();
        break;

      case "query":
        data = c.req.query();
        break;

      case "param":
        data = c.req.param();
        break;
    }

    const result = v.safeParse(schema, data);

    if (!result.success) {
      throw new ValidationError(result.issues[0]?.message || responseMessage.validation);
    }

    c.set(target, result.output);

    await next();
  });
}
