import { TRPCError } from "@trpc/server";

import { userService } from "../../services/index";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
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
    .mutation(async ({ input }) => {
      const { fullName, email, password } = input;
      try {
        const { id } = await userService.createUserWithEmailAndPassword({
          fullName,
          email,
          password,
        });
        return { id };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Signup failed" });
      }
    }),
});
