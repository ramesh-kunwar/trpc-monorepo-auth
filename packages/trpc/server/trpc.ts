import { TRPCError, initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { ZodError } from "zod";

import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;
