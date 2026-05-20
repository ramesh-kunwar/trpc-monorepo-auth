import { trpc } from "~/trpc/client";

export const useSignup = () => {
  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    mutate: createUserWithEmailAndPassword,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation();

  return {
    createUserWithEmailAndPasswordAsync,
    createUserWithEmailAndPassword,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useSignIn = () => {
  const {
    mutateAsync: signInUserWithEmailAndPasswordAsync,

    mutate: signInUserWithEmailAndPassword,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.signInUserWithEmailAndPasswordInput.useMutation();
  return {
    signInUserWithEmailAndPasswordAsync,
    signInUserWithEmailAndPassword,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};
