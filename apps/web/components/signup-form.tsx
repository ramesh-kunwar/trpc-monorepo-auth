"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useSignup } from "~/hooks/api/auth";
import { cn } from "~/lib/utils";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const { createUserWithEmailAndPasswordAsync } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(values: SignupFormValues) {
    try {
      await createUserWithEmailAndPasswordAsync({
        email: values.email,
        fullName: values.name,
        password: values.password,
      });
      toast.success("Account created", {
        description: "Welcome! You can now sign in.",
      });
      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error("Signup failed", { description: message });
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
          {errors.name && (
            <FieldDescription className="text-destructive">{errors.name.message}</FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && (
            <FieldDescription className="text-destructive">{errors.email.message}</FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <FieldDescription className="text-destructive">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <FieldDescription className="text-destructive">
              {errors.confirmPassword.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </Field>
      </FieldGroup>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </a>
      </p>
    </form>
  );
}
