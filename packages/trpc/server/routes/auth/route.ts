import { TRPCError } from "@trpc/server";

import { signInUserWithEmailAndPasswordInput } from "@repo/services/user/model";

import { userService } from "../../services/index";
import { publicProcedure, router } from "../../trpc";
import { setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  signInUserWithEmailAndPasswordInputModel,
  signInUserWithEmailAndPasswordOutputModel,
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;
      try {
        const { id, token } = await userService.createUserWithEmailAndPassword({
          fullName,
          email,
          password,
        });
        setAuthenticationCookie(ctx, token);
        return { id };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Signup failed" });
      }
    }),

  signInUserWithEmailAndPasswordInput: publicProcedure
    .meta({
      openapi: {
        method: "POST",

        path: getPath("/signInUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      try {
        const { id, token } = await userService.signInUserWithEmailAandPassword({
          email,
          password,
        });
        setAuthenticationCookie(ctx, token);
        return { id };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Login failed" });
      }
    }),
});
