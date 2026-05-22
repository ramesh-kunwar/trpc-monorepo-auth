import { trpc } from "~/trpc/client";

export const useSignup = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    mutate: createUserWithEmailAndPassword,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

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
  const utils = trpc.useUtils();
  const {
    mutateAsync: signInUserWithEmailAndPasswordAsync,

    mutate: signInUserWithEmailAndPassword,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.signInUserWithEmailAndPasswordInput.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });
  return {
    signInUserWithEmailAndPasswordAsync,
    signInUserWithEmailAndPassword,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useuser = () => {
  const {
    data: user,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.auth.getLoggedInUserInfo.useQuery();
  return {
    user,
    error,
    isFetched,
    isFetching,
    isLoading,
  };
};
