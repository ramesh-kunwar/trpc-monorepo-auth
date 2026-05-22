"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useSignIn } from "~/hooks/api/auth";
import { cn } from "~/lib/utils";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const { signInUserWithEmailAndPasswordAsync } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await signInUserWithEmailAndPasswordAsync({ email: values.email, password: values.password });
      toast.success("Signed in", {
        description: "Welcome back!",
      });
      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error("Login failed", { description: message });
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && (
            <FieldDescription className="text-destructive">{errors.email.message}</FieldDescription>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot password?
            </a>
          </div>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <FieldDescription className="text-destructive">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </Field>
      </FieldGroup>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4 hover:text-foreground">
          Sign up
        </a>
      </p>
    </form>
  );
}
