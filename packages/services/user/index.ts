import { createHmac, randomBytes } from "node:crypto";

import { TRPCError } from "@trpc/server";
import * as jwt from "jsonwebtoken";

import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";

import { env } from "../env";
import {
  type CreateUserWithEmailAndPasswordInputType,
  GenerateUserTokenPayloadType,
  SignInUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  signInUserWithEmailAndPasswordInput,
} from "./model";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = jwt.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail)
      throw new TRPCError({ code: "CONFLICT", message: `User with email ${email} already exists` });

    const salt = randomBytes(16).toString("hex");
    const hash = await this.generateHash(salt, password);

    const userInsertResult = await db
      .insert(usersTable)
      .values({ email, fullName, password: hash, salt })
      .returning({
        id: usersTable.id,
      });

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create user" });

    const userId = userInsertResult[0].id;
    const { token } = await this.generateUserToken({ id: userId });
    return {
      id: userInsertResult[0]?.id,
      token,
    };
  }

  public async signInUserWithEmailAandPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (!existingUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `User with email ${email} does not exists`,
      });
    if (!existingUser?.password || !existingUser.salt)
      throw new TRPCError({ code: "NOT_FOUND", message: "Invalid authentication method" });
    const hash = await this.generateHash(existingUser.salt, password);

    if (hash !== existingUser.password)
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });

    const { token } = await this.generateUserToken({ id: existingUser.id });
    return {
      id: existingUser.id,
      token,
    };
  }
}

export default UserService;
